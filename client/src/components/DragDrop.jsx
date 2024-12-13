import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { gsap } from "gsap";
import "./DragDrop.css";

const DragDrop = () => {
    const [uploadedFile, setUploadedFile] = useState(null); // To store the uploaded raw file
    const [selectedOption, setSelectedOption] = useState("option1"); // Default to Wiener Filter
    const [processedFile, setProcessedFile] = useState(null); // To store the processed result

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(file); // Store the raw file for upload
            setProcessedFile(null); // Clear previous results
            console.log("File uploaded:", file);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpg", ".jpeg", ".tif", ".tiff"] }, // Allow TIF and JPG
        multiple: false,
    });

    const handleOptionSwitch = () => {
        const tl = gsap.timeline();

        tl.to(".toggle-description", { opacity: 0, y: -10, duration: 0.3 })
            .to(".upload-area", { opacity: 0, scale: 0.95, duration: 0.3 }, "-=0.3")
            .add(() => {
                setSelectedOption(selectedOption === "option1" ? "option2" : "option1");
                setUploadedFile(null);
                setProcessedFile(null);
            })
            .to(".toggle-description", { opacity: 1, y: 0, duration: 0.3 })
            .to(".upload-area", { opacity: 1, scale: 1, duration: 0.3 }, "-=0.3");
    };

    const handleProcessImage = async () => {
        if (!uploadedFile) {
            alert("Please upload an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append(
            "process_type",
            selectedOption === "option1" ? "wiener" : "periodic"
        );

        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error processing image");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setProcessedFile(url); // Display the processed image
        } catch (error) {
            console.error("Processing error:", error);
            alert("An error occurred while processing the image.");
        }
    };

    return (
        <section className="dragdrop-section">
            <div className="dragdrop-header">
                <h1>Image Processing</h1>
                <p>
                    Transform your images with advanced tools. Choose between Wiener Filtering for restoring blurred images
                    or Periodic Noise Filtering to remove unwanted periodic patterns.
                </p>
            </div>
            <div className="dragdrop-content">
                <div className="option-toggle">
                    <div className="toggle-description">
                        {selectedOption === "option1"
                            ? "Wiener Filter: Restore blurred images using advanced techniques."
                            : "Periodic Noise Filtering: Detect and remove unwanted periodic noise in images."}
                    </div>
                    <button
                        className={`toggle-button ${selectedOption === "option1" ? "active" : ""}`}
                        onClick={handleOptionSwitch}
                    >
                        {selectedOption === "option1" ? "Periodic Noise Filtering" : "Wiener Filtering"}
                    </button>
                </div>
                <div className="upload-area" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag image here or click to upload</p>
                    <button className="upload-button" onClick={handleProcessImage}>
                        {selectedOption === "option1"
                            ? "Restore Blurred Image"
                            : "Apply Periodic Noise Filtering"}
                    </button>
                </div>
            </div>

            {processedFile && ( // Show images only if processed file is available
                <div className="image-container">
                    <div className="image-preview before">
                        <h3>Before</h3>
                        <img src={URL.createObjectURL(uploadedFile)} alt="Uploaded Preview" />
                    </div>
                    <div className="image-preview after">
                        <h3>Final Result</h3>
                        <img src={processedFile} alt="Processed Result" />
                    </div>
                </div>
            )}
        </section>
    );
};

export default DragDrop;









// import React, { useState, useCallback } from "react";
// import { useDropzone } from "react-dropzone";
// import "./DragDrop.css";

// const DragDrop = () => {
//     const [uploadedFile, setUploadedFile] = useState(null);

//     const onDrop = useCallback((acceptedFiles) => {
//         if (acceptedFiles.length > 0) {
//             const file = acceptedFiles[0];
//             setUploadedFile(URL.createObjectURL(file));
//             console.log("File uploaded:", file);
//         }
//     }, []);

//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop,
//         accept: { "image/*": [] },
//         multiple: false,
//     });

//     return (
//         <section className="dragdrop-section">
//             <div className="dragdrop-header">
//                 <h1>Photo Enhancer AI: Upscale Image Quality & Resolution</h1>
//                 <p>
//                     Enhance photos effortlessly with AI photo enhancer. Increase image resolution,
//                     improve colors, and make photos clear online for free with just a click!
//                 </p>
//             </div>
//             <div className="dragdrop-content">
//                 {/* Left side: Image preview or placeholder */}
//                 <div className="image-preview">
//                     {uploadedFile ? (
//                         <img src={uploadedFile} alt="Uploaded Preview" />
//                     ) : (
//                         <div className="placeholder">
//                             <p>Before</p>
//                             <p className="upload-placeholder">Image will appear here after upload</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Right side: Drag and Drop or Upload */}
//                 <div className="upload-area" {...getRootProps()}>
//                     <input {...getInputProps()} />
//                     <p>Drag image here or click to upload</p>
//                     <button className="upload-button">Enhance Photo Now</button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default DragDrop;
