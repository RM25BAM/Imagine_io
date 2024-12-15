import numpy as np
import cv2
from scipy.fft import fft2, ifft2, fftshift, ifftshift
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import os
import base64

def gaussian_notch_filter(shape, u, v, D0, B):
    rows, cols = shape
    U, V = np.meshgrid(range(cols), range(rows))
    U = U - cols // 2
    V = V - rows // 2
    D1 = np.sqrt((U - u) ** 2 + (V - v) ** 2)
    D2 = np.sqrt((U + u) ** 2 + (V + v) ** 2)
    H1 = np.exp(-B * (D1**2 / (2 * D0**2)))
    H2 = np.exp(-B * (D2**2 / (2 * D0**2)))
    H = 1 - (H1 * H2)
    return H

def detect_and_filter_peaks(image, D0, B, n, T):
    f = fft2(image)
    fshift = fftshift(f)
    magnitude_spectrum = np.abs(fshift)

    median_value = np.median(magnitude_spectrum)
    threshold = median_value + T * np.std(magnitude_spectrum)

    rows, cols = image.shape
    filter_mask = np.ones((rows, cols))
    center_x, center_y = rows // 2, cols // 2

    for i in range(rows):
        for j in range(cols):
            if (center_x - n <= i <= center_x + n and center_y - n <= j <= center_y + n):
                continue
            if magnitude_spectrum[i, j] > threshold:
                u, v = i - rows // 2, j - cols // 2
                notch_filter = gaussian_notch_filter((rows, cols), u, v, D0, B)
                filter_mask *= notch_filter

    filtered_shift = fshift * filter_mask
    filtered_image = np.abs(ifft2(ifftshift(filtered_shift)))
    rmse, psnr = calculate_rmse_psnr(image, filtered_image)
    return np.clip(filtered_image, 0, 255).astype(np.uint8), rmse, psnr

def calculate_rmse_psnr(image, filtered_image):
    image1 = np.clip(image, 0, 255).astype(np.float32)
    image2 = np.clip(filtered_image, 0, 255).astype(np.float32)
    diff = image1 - image2
    mse = np.mean(diff**2)
    rmse = np.sqrt(mse)
    max_pixel_value = 255
    psnr = 20 * np.log10(max_pixel_value / rmse)
    return rmse, psnr

def calculate_bsnr_isnr(original, noisy, restored):
    signal_power = np.var(original)
    residual = noisy - restored
    noise_power = np.var(residual)
    bsnr = 10 * np.log10(signal_power / noise_power)
    restored_signal_power = np.var(restored)
    isnr = 10 * np.log10(restored_signal_power / noise_power)
    return bsnr, isnr

def wiener_filter(image, alpha):
    kernel = np.ones((5, 5), np.float32) / 25
    blurred = cv2.filter2D(image, -1, kernel)
    noise = np.random.normal(0, 0.1, image.shape)
    noisy_blurred = blurred + noise

    f = fft2(noisy_blurred)
    H = fft2(kernel, s=image.shape)
    H_conj = np.conj(H)
    wiener_restored = np.abs(ifft2((H_conj / (H * H_conj + alpha)) * f))
    bsnr, isnr = calculate_bsnr_isnr(image, noisy_blurred, wiener_restored)
    
    return np.clip(wiener_restored, 0, 255).astype(np.uint8), bsnr, isnr

class ImageUpload(Resource):
    def post(self):
        UPLOAD_FOLDER = 'uploads'
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        file = request.files.get('file')
        process_type = request.form.get('process_type')
        D0 = request.form.get('D0', None)
        B = request.form.get('B', None)
        n = request.form.get('n', None)
        T = request.form.get('T', None)
        alpha = request.form.get('alpha', None)

        if not file or not process_type:
            return jsonify({"message": "File and process type are required"}), 400

        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        image = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)

        try:
            if process_type == 'periodic':
                if not all([D0, B, n, T]):
                    return jsonify({"message": "Parameters D0, B, n, and T are required"}), 400
                D0, B, n, T = float(D0), float(B), int(n), float(T)
                result_image, rmse, psnr = detect_and_filter_peaks(image, D0, B, n, T)
                bsnr, isnr = 0, 0
            elif process_type == 'wiener':
                if alpha is None:
                    return jsonify({"message": "Alpha parameter is required"}), 400
                alpha = float(alpha)
                result_image, bsnr, isnr = wiener_filter(image, alpha)
                rmse, psnr = calculate_rmse_psnr(image, result_image)
            else:
                return jsonify({"message": "Invalid process type"}), 400
        except Exception as e:
            return jsonify({"message": f"Processing error: {e}"}), 500

        _, buffer = cv2.imencode('.png', result_image)
        encoded_image = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            "message": "Processing successful",
            "processed_image": encoded_image,
            "psnr": float(psnr),
            "rmse": float(rmse),
            "bsnr": float(bsnr),
            "isnr": float(isnr)
        })

app = Flask(__name__)
CORS(app)
api = Api(app)
api.add_resource(ImageUpload, '/upload')

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
