import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./DragDrop.css";

const DragDrop = () => {
    const [uploadedFile, setUploadedFile] = useState(null);

    // UseCallback ensures the onDrop function doesn't get recreated unnecessarily
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(URL.createObjectURL(file)); // Create a preview URL for the uploaded file
            console.log("File uploaded:", file);
        }
    }, []);

    // Configure Dropzone with options
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [], // Accept all image types
        },
        multiple: false, // Allow only one file
    });

    return (
        <section className="dragdrop-section">
            {/* Dropzone Container */}
            <div
                {...getRootProps({
                    className: "dragdrop-container",
                })}
                style={{
                    border: "2px dashed #cccccc",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                }}
            >
                <input {...getInputProps()} />
                <p>Drag and drop an image here, or click to select one</p>
            </div>

            {/* Uploaded File Preview */}
            {uploadedFile && (
                <div className="uploaded-preview">
                    <h3>Uploaded Image Preview:</h3>
                    <img
                        src={uploadedFile}
                        alt="Uploaded Preview"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            marginTop: "20px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>
            )}
        </section>
    );
};

export default DragDrop;
