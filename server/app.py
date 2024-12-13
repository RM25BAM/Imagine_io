from flask import Flask, request, send_file
import numpy as np
import cv2
from scipy.signal import convolve2d
from scipy.fft import fft2, ifft2, fftshift, ifftshift
import os
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)
print(f"Saved file at: {filepath}")


# Helper functions for processing
def gaussian_notch_filter(shape, u, v, D0):
    """Generate a Gaussian Notch filter centered at (u, v) with cutoff frequency D0."""
    rows, cols = shape
    U, V = np.meshgrid(range(cols), range(rows))
    U = U - cols // 2
    V = V - rows // 2
    D1 = np.sqrt((U - u) ** 2 + (V - v) ** 2)
    D2 = np.sqrt((U + u) ** 2 + (V + v) ** 2)
    H = 1 - np.exp(-D1**2 / (2 * (D0 ** 2))) * np.exp(-D2**2 / (2 * (D0 ** 2)))
    return H

def detect_and_filter_peaks(image, D0=10):
    """Detect periodic noise and apply Gaussian Median Notch filter."""
    f = fft2(image)
    fshift = fftshift(f)
    magnitude_spectrum = np.abs(fshift)

    median_value = np.median(magnitude_spectrum)
    abnormal_peaks = magnitude_spectrum > (3 * median_value)

    rows, cols = image.shape
    filter_mask = np.ones((rows, cols))
    for (i, j) in np.argwhere(abnormal_peaks):
        notch_filter = gaussian_notch_filter((rows, cols), i - rows // 2, j - cols // 2, D0)
        filter_mask *= notch_filter

    filtered_shift = fshift * filter_mask
    filtered_image = np.abs(ifft2(ifftshift(filtered_shift)))
    return filtered_image

def wiener_filter(blurred_image, psf, noise_variance, alpha):
    """Apply Wiener filter with regularization."""
    G = fft2(blurred_image)
    H = fft2(psf, s=blurred_image.shape)
    H_conj = np.conj(H)
    K = noise_variance / np.var(blurred_image)
    F_hat = (H_conj / (np.abs(H)**2 + alpha * K)) * G
    restored_image = np.abs(ifft2(F_hat))
    return restored_image

@app.route('/upload', methods=['POST'])
def upload():
    # Save the uploaded file
    file = request.files.get('file')
    process_type = request.form.get('process_type')

    if not file or not process_type:
        return "Invalid input", 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    image = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE).astype(np.float32)
    if process_type == 'periodic':
        result_image = detect_and_filter_peaks(image)
    elif process_type == 'wiener':
        psf = np.ones((5, 5)) / 25
        noise_variance = 0.01
        result_image = wiener_filter(image, psf, noise_variance, alpha=0.01)
    else:
        return "Invalid process type", 400

    # Save the processed image in a compatible format
    result_path = os.path.join(RESULT_FOLDER, 'processed_image.png')
    cv2.imwrite(result_path, result_image)

    # Return the processed image with the correct MIME type
    return send_file(result_path, mimetype='image/png')



if __name__ == '__main__':
    app.run(debug=True)



""" from flask import Flask, request, render_template, send_file
import numpy as np
import cv2
from scipy.signal import convolve2d
from scipy.fft import fft2, ifft2
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# Helper functions for Project 2 (Wiener filter)
def generate_psf(size, std_dev):
    x = np.linspace(-size // 2, size // 2, size)
    y = np.linspace(-size // 2, size // 2, size)
    X, Y = np.meshgrid(x, y)
    psf = np.exp(-(X**2 + Y**2) / (2 * std_dev**2))
    psf /= psf.sum()  # Normalize the PSF
    return psf

def add_blur(image, psf):
    blurred = convolve2d(image, psf, mode='same', boundary='wrap')
    return blurred

def add_gaussian_noise(image, mean=0, std=10):
    noise = np.random.normal(mean, std, image.shape)
    noisy_image = image + noise
    return noisy_image, noise

def estimate_noise_variance(noisy_image, filtered_image):
    noise = noisy_image - filtered_image
    noise_variance = np.var(noise)
    return noise_variance

def compute_bsnr(original, noisy):
   
    signal_power = np.mean(original**2)
    noise_power = np.mean((original - noisy)**2)
    bsnr = 10 * np.log10(signal_power / noise_power)
    return bsnr

def compute_isnr(original, noisy, restored):
   
    noisy_error = np.mean((original - noisy)**2)
    restored_error = np.mean((original - restored)**2)
    isnr = 10 * np.log10(noisy_error / restored_error)
    return isnr

def wiener_filter(blurred_image, psf, noise_variance, alpha):

    # Fourier transform of the blurred image and PSF
    G = fft2(blurred_image)
    H = fft2(psf, s=blurred_image.shape)
    
    # Wiener filter formula
    H_conj = np.conj(H)
    K = noise_variance / np.var(blurred_image)
    F_hat = (H_conj / (np.abs(H)**2 + alpha * K)) * G
    
    # Inverse Fourier transform to get the restored image
    restored_image = np.abs(ifft2(F_hat))
    return restored_image

# Helper functions for Project 3 (Image filtering in spatial domain)
def apply_filter(image, kernel):
 
    return cv2.filter2D(image, -1, kernel)

def apply_median_filter(image, ksize=3):
   
    return cv2.medianBlur(image, ksize)

def apply_mean_filter(image, ksize=3):
   
    return cv2.blur(image, (ksize, ksize))

def unsharp_masking(image, alpha=1.5, ksize=3):

    blurred = cv2.GaussianBlur(image, (ksize, ksize), 0)
    sharpened = cv2.addWeighted(image, 1 + alpha, blurred, -alpha, 0)
    return sharpened

def compute_statistics(image1, image2):

    mse = np.mean((image1 - image2) ** 2)
    psnr = 20 * np.log10(255.0 / np.sqrt(mse)) if mse > 0 else float('inf')
    return {"RMSE": np.sqrt(mse), "PSNR": psnr}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return "No file part"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"
    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Process the image based on user selection
        image = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE).astype(np.float32)
        filter_type = request.form.get('filter_type', 'wiener')

        if filter_type == 'wiener':
            # Project 2: Wiener filtering
            psf = generate_psf(size=15, std_dev=3)
            blurred_image = add_blur(image, psf)
            noisy_image, _ = add_gaussian_noise(blurred_image, std=10)
            filtered_image = cv2.GaussianBlur(noisy_image, (3, 3), 0)
            noise_variance = estimate_noise_variance(noisy_image, filtered_image)
            alpha = 0.01
            restored_image = wiener_filter(noisy_image, psf, noise_variance, alpha)
        else:
            # Project 3: Spatial domain filtering
            if filter_type == 'median':
                restored_image = apply_median_filter(image)
            elif filter_type == 'mean':
                restored_image = apply_mean_filter(image)
            elif filter_type == 'unsharp':
                restored_image = unsharp_masking(image)
            else:
                return "Invalid filter type selected"

        # Save the result
        result_path = os.path.join(RESULT_FOLDER, 'restored_image.tif')
        cv2.imwrite(result_path, restored_image)

        return send_file(result_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
 """