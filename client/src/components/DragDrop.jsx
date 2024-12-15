import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { gsap } from "gsap";
import "./DragDrop.css";

const DragDrop = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [selectedOption, setSelectedOption] = useState("option1");
    const [processedFile, setProcessedFile] = useState(null);
    const [alpha, setAlpha] = useState(0.01);
    const [D0, setD0] = useState(10);
    const [B, setB] = useState(0.5);
    const [n, setN] = useState(10);
    const [T, setT] = useState(3);
    const [psnr, setPsnr] = useState(null);
    const [rmse, setRmse] = useState(null);
    const [bsnr, setBsnr] = useState(null);
    const [isnr, setIsnr] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(file);
            setProcessedFile(null);
            setPsnr(null);
            setRmse(null);
            setBsnr(null);
            setIsnr(null);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpg", ".jpeg", ".tif", ".tiff", ".png"] },
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
                setPsnr(null);
                setRmse(null);
                setBsnr(null);
                setIsnr(null);
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

        if (selectedOption === "option1") {
            formData.append("alpha", alpha);
        } else if (selectedOption === "option2") {
            formData.append("D0", D0);
            formData.append("B", B);
            formData.append("n", n);
            formData.append("T", T);
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/upload", {
                method: "POST",
                body: formData,
            });

            const json = await response.json();

            if (json.processed_image) {
                const processedImageURL = `data:image/png;base64,${json.processed_image}`;
                setProcessedFile(processedImageURL);
            }

            if (json.psnr !== undefined && json.rmse !== undefined) {
                setPsnr(json.psnr);
                setRmse(json.rmse);
            }

            if (json.bsnr !== undefined && json.isnr !== undefined) {
                setBsnr(json.bsnr);
                setIsnr(json.isnr);
            }
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
                    {selectedOption === "option1" && (
                        <div className="alpha-input">
                            <label htmlFor="alpha" className="alpha-label">
                                Alpha:
                            </label>
                            <input
                                type="number"
                                id="alpha"
                                value={alpha}
                                onChange={(e) => setAlpha(e.target.value)}
                                placeholder="Enter alpha value"
                            />
                        </div>
                    )}
                    {selectedOption === "option2" && (
                        <div className="periodic-inputs">
                            <label>
                                D0:
                                <input
                                    type="number"
                                    value={D0}
                                    onChange={(e) => setD0(e.target.value)}
                                />
                            </label>
                            <label>
                                B:
                                <input
                                    type="number"
                                    value={B}
                                    onChange={(e) => setB(e.target.value)}
                                />
                            </label>
                            <label>
                                n:
                                <input
                                    type="number"
                                    value={n}
                                    onChange={(e) => setN(e.target.value)}
                                />
                            </label>
                            <label>
                                T:
                                <input
                                    type="number"
                                    value={T}
                                    onChange={(e) => setT(e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                    <button className="toggle-button" onClick={handleOptionSwitch}>
                        {selectedOption === "option1" ? "Periodic Noise Filtering" : "Wiener Filtering"}
                    </button>
                </div>
                <div className="upload-area" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag image here or click to upload</p>
                    <button
                        className="upload-button"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent click event from propagating to the drag-and-drop container
                            handleProcessImage(); // Call the actual process function
                        }}
                    >
                        Process Image
                    </button>
                </div>
            </div>
            {uploadedFile && (
                <div className="image-container">
                    <div className="image-preview">
                        <h3>Before</h3>
                        <img src={URL.createObjectURL(uploadedFile)} alt="Before" />
                    </div>
                    {processedFile && (
                        <div className="image-preview">
                            <h3>After</h3>
                            <img src={processedFile} alt="After" />
                        </div>
                    )}
                </div>
            )}
            {processedFile && (
                <div className="metrics-container">
                    <div className="metrics">
                        <p>
                            <strong>PSNR:</strong> {psnr !== null ? `${psnr.toFixed(2)} dB` : "N/A"} <br />
                            <strong>RMSE:</strong> {rmse !== null ? `${rmse.toFixed(2)}` : "N/A"} <br />

                            {selectedOption === "option1" && (
                                <>
                                    <strong>BSNR:</strong> {bsnr !== null ? `${bsnr.toFixed(2)} dB` : "N/A"} <br />
                                    <strong>ISNR:</strong> {isnr !== null ? `${isnr.toFixed(2)} dB` : "N/A"} <br />
                                </>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DragDrop;

