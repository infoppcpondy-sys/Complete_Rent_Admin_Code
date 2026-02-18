import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import './605010.css';

const AdminDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentPropertyId, setCurrentPropertyId] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    // Form data
    const [formData, setFormData] = useState({
        createdBy: '',
        propertyMode: 'Commercial',
        propertyType: '',
        rentType: 'Rent',
        rentAmount: '',
        leaseAmount: '',
        advanceAmount: '',
        streetName: '',
        location: '',
        phoneNumber: '',
        url: '',
        bhk: 'No',
        floor: 'Ground Floor'
    });
    
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    
    // Filters
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        propertyMode: '',
        propertyType: '',
        rentType: '',
        location: '',
        search: '',
        createdBy: '',
        createdAt: ''
    });
    const [totalPages, setTotalPages] = useState(1);

    // Redux & Role-Based Access Control
    const reduxAdminName = useSelector((state) => state.admin.name);
    const reduxAdminRole = useSelector((state) => state.admin.role);
    
    const adminName = reduxAdminName || localStorage.getItem("adminName");
    const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
    
    const [allowedRoles, setAllowedRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [phoneNumberCount, setPhoneNumberCount] = useState(0);
    const [tableImageIndices, setTableImageIndices] = useState({});
    const [isCompressing, setIsCompressing] = useState(false);
    
    const fileName = "605010"; // current file
    
    // Sync Redux to localStorage
    useEffect(() => {
        if (reduxAdminName) localStorage.setItem("adminName", reduxAdminName);
        if (reduxAdminRole) localStorage.setItem("adminRole", reduxAdminRole);
    }, [reduxAdminName, reduxAdminRole]);
    
    // Record dashboard view
    useEffect(() => {
        const recordDashboardView = async () => {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
                    userName: adminName,
                    role: adminRole,
                    viewedFile: fileName,
                    viewTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                });
            } catch (err) {
                console.error("Error recording view:", err);
            }
        };
    
        if (adminName && adminRole) {
            recordDashboardView();
        }
    }, [adminName, adminRole]);
    
    // Fetch role-based permissions
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`);
                const rolePermissions = res.data.find((perm) => perm.role === adminRole);
                const viewed = rolePermissions?.viewedFiles?.map(f => f.trim()) || [];
                setAllowedRoles(viewed);
            } catch (err) {
                console.error("Error fetching permissions:", err);
            } finally {
                setLoading(false);
            }
        };
    
        if (adminRole) {
            fetchPermissions();
        }
    }, [adminRole]);

    // Fetch all properties
    const fetchProperties = async () => {
        try {
            setError(null);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/read-prop`, {
                params: filters
            });
            setProperties(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching properties');
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [filters]);

    // Auto-cycle images in table view
    useEffect(() => {
        const intervals = {};
        
        properties.forEach(property => {
            if (property.images && property.images.length > 1) {
                intervals[property._id] = setInterval(() => {
                    setTableImageIndices(prev => ({
                        ...prev,
                        [property._id]: ((prev[property._id] || 0) + 1) % property.images.length
                    }));
                }, 3000); // Change image every 3 seconds
            }
        });
        
        return () => {
            Object.values(intervals).forEach(interval => clearInterval(interval));
        };
    }, [properties]);

    // Reset form
    const resetForm = () => {
        setFormData({
            createdBy: '',
            propertyMode: 'Commercial',
            propertyType: '',
            rentType: 'Rent',
            rentAmount: '',
            leaseAmount: '',
            advanceAmount: '',
            streetName: '',
            location: '',
            phoneNumber: '',
            url: '',
            bhk: 'No',
            floor: 'Ground Floor'
        });
        setImages([]);
        setImagePreviews([]);
        setExistingImages([]);
        setIsEdit(false);
        setCurrentPropertyId(null);
        setShowForm(false);
        setError(null);
        setPhoneNumberCount(0);
        setDragActive(false);
    };

    // Handle add new property button
    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    // Handle edit property
    const handleEdit = async (property) => {
        setIsEdit(true);
        setCurrentPropertyId(property._id);
        setFormData({
            createdBy: property.createdBy || '',
            propertyMode: property.propertyMode || 'Commercial',
            propertyType: property.propertyType || '',
            rentType: property.rentType || 'Rent',
            rentAmount: property.rentAmount || '',
            leaseAmount: property.leaseAmount || '',
            advanceAmount: property.advanceAmount || '',
            streetName: property.streetName,
            location: property.location,
            phoneNumber: property.phoneNumber,
            url: property.url || '',
            bhk: property.bhk || 'No',
            floor: property.floor || 'Ground Floor'
        });
        setExistingImages(property.images || []);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle view property details
    const handleView = (property) => {
        setSelectedProperty(property);
    };

    // Handle image click for lightbox gallery
    const handleImageClick = (property, imageIndex = 0) => {
        setSelectedImage(property);
        setSelectedImageIndex(imageIndex);
    };

    // Handle close image modal
    const handleCloseImageModal = () => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
    };

    // Handle next image in gallery
    const handleNextImage = () => {
        if (selectedImage && selectedImage.images) {
            setSelectedImageIndex((prev) => 
                prev === selectedImage.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    // Handle previous image in gallery
    const handlePreviousImage = () => {
        if (selectedImage && selectedImage.images) {
            setSelectedImageIndex((prev) => 
                prev === 0 ? selectedImage.images.length - 1 : prev - 1
            );
        }
    };

    // Handle delete property
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/delete-prop/${id}`);
                fetchProperties();
                alert('Property deleted successfully!');
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting property');
            }
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Check if phone number already exists and count occurrences
        if (name === 'phoneNumber' && value.length === 10) {
            const count = properties.filter(property => property.phoneNumber === value && property._id !== currentPropertyId).length;
            setPhoneNumberCount(count);
        } else if (name === 'phoneNumber') {
            setPhoneNumberCount(0);
        }
    };

    // Generate masked phone number (e.g., 9876543210 -> 98765*****)
    const getMaskedPhoneNumber = (phoneNumber) => {
        if (!phoneNumber || phoneNumber.length < 10) return 'N/A';
        const str = phoneNumber.toString();
        return str.substring(0, 5) + '*****';
    };

    // Add watermark to canvas - centered with high opacity
    const addWatermark = (ctx, width, height) => {
        const watermarkText = 'RENT PONDY';
        const fontSize = Math.min(width / 5, height / 5, 80); // Responsive font size, max 80px
        
        ctx.save();
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White with 50% opacity (increased from 15%)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw watermark once in the center of the image
        ctx.fillText(watermarkText, width / 2, height / 2);
        
        ctx.restore();
    };

    // Compress image to under 500KB with watermark
    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Resize if image is too large (max 1200px width)
                    if (width > 1200) {
                        height = (height * 1200) / width;
                        width = 1200;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Add watermark to the image
                    addWatermark(ctx, width, height);
                    
                    // Compress with quality adjustment to ensure < 500KB
                    let quality = 0.8;
                    let blob;
                    
                    const tryCompress = () => {
                        canvas.toBlob((currentBlob) => {
                            if (currentBlob.size > 512000 && quality > 0.3) {
                                // If still > 500KB, reduce quality and try again
                                quality -= 0.1;
                                canvas.toBlob(tryCompress, 'image/jpeg', quality);
                            } else {
                                // Create a new File object with compressed data
                                const compressedFile = new File([currentBlob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: file.lastModified
                                });
                                resolve({
                                    file: compressedFile,
                                    originalSize: file.size,
                                    compressedSize: currentBlob.size
                                });
                            }
                        }, 'image/jpeg', quality);
                    };
                    
                    tryCompress();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    // Helper function to read file as data URL
    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    };

    // Handle image selection and drag-drop
    const handleImageChange = async (e) => {
        const files = e.target.files ? Array.from(e.target.files) : Array.from(e.dataTransfer.files);
        const validFiles = files.filter((file) => file.type.startsWith('image/'));
        
        // Limit to 10 images total
        const totalImages = images.length + validFiles.length;
        if (totalImages > 10) {
            alert('Maximum 10 images allowed!');
            return;
        }
        
        setIsCompressing(true);
        
        try {
            // Compress all images and get their data URLs in parallel
            const compressionPromises = validFiles.map(async (file) => {
                const { file: compressedFile, originalSize, compressedSize } = await compressImage(file);
                const dataURL = await readFileAsDataURL(compressedFile);
                
                return {
                    compressedFile,
                    preview: {
                        src: dataURL,
                        name: file.name,
                        originalSize: (originalSize / 1024 / 1024).toFixed(2),
                        compressedSize: (compressedSize / 1024 / 1024).toFixed(2)
                    }
                };
            });
            
            // Wait for all compressions to complete
            const results = await Promise.all(compressionPromises);
            
            // Extract compressed files and previews
            const compressedFilesWithInfo = results.map(r => r.compressedFile);
            const previewsData = results.map(r => r.preview);
            
            // Update state with all images at once
            setImages(prev => [...prev, ...compressedFilesWithInfo]);
            setImagePreviews(prev => [...prev, ...previewsData]);
            setIsCompressing(false);
        } catch (error) {
            console.error('Error compressing images:', error);
            setIsCompressing(false);
            alert('Error compressing images. Please try again.');
        }
    };

    // Remove image by index
    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Remove existing image
    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Drag handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleImageChange(e);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Saving...';

        try {
            const submitData = new FormData();
            
            // Add form fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    submitData.append(key, formData[key]);
                }
            });

            // Add new images
            images.forEach(image => {
                submitData.append('images', image);
            });

            // Add existing images URLs (for edit mode)
            if (isEdit) {
                existingImages.forEach(img => {
                    submitData.append('existingImages', img.url);
                });
            }

            if (isEdit) {
                await axios.put(`${process.env.REACT_APP_API_URL}/update-prop/${currentPropertyId}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Property updated successfully!');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/add-prop`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Property created successfully!');
            }
            
            resetForm();
            fetchProperties();
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving property');
            alert(err.response?.data?.message || 'Error saving property');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    // Permission checks
    if (loading) return <p>Loading...</p>;
    
    if (!allowedRoles.includes(fileName)) {
        return (
            <div className="text-center text-red-500 font-semibold text-lg mt-10">
                Only admin is allowed to view this file.
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>🏠 Exclusive Locations</h1>
                {!showForm && (
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        + Add New Property
                    </button>
                )}
            </div>

            {/* ADD/EDIT FORM SECTION */}
            {showForm && (
                <div className="form-section">
                    <div className="form-header">
                        <h2>{isEdit ? '✏️ Edit Property' : '➕ Add New Property'}</h2>
                        <button className="btn btn-close" onClick={resetForm}>
                            ✕ Cancel
                        </button>
                    </div>

                    {error && <div className="error-message">❌ {error}</div>}

                    <form onSubmit={handleSubmit} className="property-form">
                        <div className="form-row">
                            {/* Created By */}
                            <div className="form-group">
                                <label>Created By Name {!isEdit ? '*' : ''}</label>
                                <input
                                    type="text"
                                    name="createdBy"
                                    value={formData.createdBy}
                                    onChange={handleInputChange}
                                    placeholder="Enter admin name"
                                    disabled={isEdit}
                                    className={isEdit ? 'form-control-readonly' : ''}
                                    required
                                />
                                {isEdit && <small style={{ color: '#0066cc', fontWeight: '600' }}>✓ Created by {formData.createdBy}</small>}
                            </div>
                        </div>

                        <div className="form-row">
                            {/* Property Mode */}
                            <div className="form-group">
                                <label>Property Mode *</label>
                                <select
                                    name="propertyMode"
                                    value={formData.propertyMode}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Commercial">Commercial</option>
                                    <option value="Residential">Residential</option>
                                </select>
                            </div>

                            {/* Property Type */}
                            <div className="form-group">
                                <label>Property Type *</label>
                                <select
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Property Type</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="House">House</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Farm House">Farm House</option>
                                    <option value="Plot">Plot</option>
                                    <option value="Land">Land</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Resorts">Resorts</option>
                                    <option value="Commercial Building">Commercial Building</option>
                                    <option value="Guest House">Guest House</option>
                                    <option value="Godown">Godown</option>
                                    <option value="Industrial Building">Industrial Building</option>
                                    <option value="Shed">Shed</option>
                                    <option value="Agricultural Land">Agricultural Land</option>
                                    <option value="Others">Others</option>
                                    <option value="Space">Space</option>
                                    <option value="Bachelor Room">Bachelor Room</option>
                                    <option value="Shop / Office">Shop / Office</option>
                                    <option value="Function Hall">Function Hall</option>
                                    <option value="P/G Hostel">P/G Hostel</option>
                                    <option value="Home Stay">Home Stay</option>
                                    <option value="Dormitory">Dormitory</option>
                                </select>
                            </div>

                            {/* Rent Type */}
                            <div className="form-group">
                                <label>Rent Type *</label>
                                <select
                                    name="rentType"
                                    value={formData.rentType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Rent">Rent</option>
                                    <option value="Lease">Lease</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            {/* Rent Amount (only for Rent type) */}
                            {formData.rentType === 'Rent' && (
                                <div className="form-group">
                                    <label>Rent Amount (₹) *</label>
                                    <input
                                        type="number"
                                        name="rentAmount"
                                        value={formData.rentAmount}
                                        onChange={handleInputChange}
                                        placeholder="Enter rent amount"
                                        required
                                    />
                                </div>
                            )}

                            {/* Lease Amount (only for Lease type) */}
                            {formData.rentType === 'Lease' && (
                                <div className="form-group">
                                    <label>Lease Amount (₹) *</label>
                                    <input
                                        type="number"
                                        name="leaseAmount"
                                        value={formData.leaseAmount}
                                        onChange={handleInputChange}
                                        placeholder="Enter lease amount"
                                        required
                                    />
                                </div>
                            )}

                            {/* Advance Amount */}
                            <div className="form-group">
                                <label>Advance Amount (₹)</label>
                                <input
                                    type="number"
                                    name="advanceAmount"
                                    value={formData.advanceAmount}
                                    onChange={handleInputChange}
                                    placeholder="Enter advance amount"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            {/* Street Name */}
                            <div className="form-group">
                                <label>Street Name *</label>
                                <input
                                    type="text"
                                    name="streetName"
                                    value={formData.streetName}
                                    onChange={handleInputChange}
                                    placeholder="Enter street name"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div className="form-group">
                                <label>Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Enter location"
                                    required
                                />
                            </div>

                            {/* URL */}
                            <div className="form-group">
                                <label>Google Map URL</label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    placeholder="Paste Google Map location URL"
                                />
                                <small>e.g., https://maps.google.com/...</small>
                            </div>
                        </div>

                        <div className="form-row">
                            {/* BHK */}
                            <div className="form-group">
                                <label>BHK</label>
                                <select
                                    name="bhk"
                                    value={formData.bhk}
                                    onChange={handleInputChange}
                                >
                                    <option value="No">No</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="5+">5+</option>
                                </select>
                            </div>

                            {/* Floor */}
                            <div className="form-group">
                                <label>Floor</label>
                                <select
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                >
                                    <option value="Basement">Basement</option>
                                    <option value="Ground Floor">Ground Floor</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8+">8+</option>
                                </select>
                            </div>
                            {/* Phone Number */}
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="10-digit phone number"
                                    pattern="[0-9]{10}"
                                    required
                                />
                                {phoneNumberCount > 0 && (
                                    <small className="warning-text">⚠️ This phone number already exists in {phoneNumberCount} propert{phoneNumberCount === 1 ? 'y' : 'ies'}</small>
                                )}
                            </div>
                        </div>

                        {/* Existing Images (Edit Mode) */}
                        {isEdit && existingImages.length > 0 && (
                            <div className="form-group">
                                <label>Existing Images</label>
                                <div className="existing-images">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="image-preview">
                                            <img 
                                                src={`${process.env.REACT_APP_MEDIA_URL}${img.url}`} 
                                                alt={`Property ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => handleRemoveExistingImage(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Images - Improved Card */}
                        <div className="form-group">
                            <label>📸 {isEdit ? 'Add More Images' : 'Upload Images'} (Max 10)</label>
                            
                            {/* Drag and Drop Area */}
                            <div
                                className={`upload-card ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="file-input-hidden"
                                    id="imageInput"
                                />
                                <label htmlFor="imageInput" className="upload-label">
                                    <div className="upload-icon">📤</div>
                                    <h3>Drag & drop images here</h3>
                                    <p>or click to browse</p>
                                    <small>Images will be auto-compressed to under 500KB</small>
                                </label>
                            </div>
                            
                            {/* Image Count Badge */}
                            {isCompressing && (
                                <div className="image-count-badge compressing-badge">
                                    🔄 Compressing images...
                                </div>
                            )}
                            
                            {(images.length > 0 || imagePreviews.length > 0) && !isCompressing && (
                                <div className="image-count-badge">
                                    ✅ {images.length} image{images.length !== 1 ? 's' : ''} selected
                                </div>
                            )}
                            
                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="image-previews-container">
                                    <h4>📷 Preview ({imagePreviews.length})</h4>
                                    <div className="image-preview-grid">
                                        {imagePreviews.map((preview, index) => {
                                            const compressionRatio = ((1 - preview.compressedSize / preview.originalSize) * 100).toFixed(0);
                                            return (
                                                <div key={index} className="preview-item">
                                                    <div className="preview-image-wrapper">
                                                        <img src={preview.src} alt={`Preview ${index + 1}`} />
                                                        <button
                                                            type="button"
                                                            className="btn-remove-preview"
                                                            onClick={() => handleRemoveImage(index)}
                                                            title="Remove image"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                    <div className="preview-info">
                                                        <p className="preview-name">{preview.name.slice(0, 20)}...</p>
                                                        <p className="preview-size">
                                                            {preview.originalSize} MB → {preview.compressedSize} MB
                                                        </p>
                                                        <p className="preview-compression">
                                                            📦 Saved {compressionRatio}%
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-success"
                            >
                                {isEdit ? '💾 Update Property' : '✅ Create Property'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* PROPERTIES LIST SECTION */}
            {!showForm && (
                <div className="properties-section">
                    <h2>📋 Properties List ({properties.length})</h2>

                    {/* FILTERS SECTION */}
                    <div className="filters-section">
                        <div className="form-row">
                            {/* Property Mode Filter */}
                            <div className="form-group">
                                <label>Property Mode</label>
                                <select
                                    name="propertyMode"
                                    value={filters.propertyMode}
                                    onChange={handleFilterChange}
                                    className="filter-select"
                                >
                                    <option value="">All Modes</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Residential">Residential</option>
                                </select>
                            </div>

                            {/* Property Type Filter */}
                            <div className="form-group">
                                <label>Property Type</label>
                                <select
                                    name="propertyType"
                                    value={filters.propertyType}
                                    onChange={handleFilterChange}
                                    className="filter-select"
                                >
                                    <option value="">All Types</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="House">House</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Farm House">Farm House</option>
                                    <option value="Plot">Plot</option>
                                    <option value="Land">Land</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Resorts">Resorts</option>
                                    <option value="Commercial Building">Commercial Building</option>
                                    <option value="Guest House">Guest House</option>
                                    <option value="Godown">Godown</option>
                                    <option value="Industrial Building">Industrial Building</option>
                                    <option value="Shed">Shed</option>
                                    <option value="Agricultural Land">Agricultural Land</option>
                                    <option value="Others">Others</option>
                                    <option value="Space">Space</option>
                                    <option value="Bachelor Room">Bachelor Room</option>
                                    <option value="Shop / Office">Shop / Office</option>
                                    <option value="Function Hall">Function Hall</option>
                                    <option value="P/G Hostel">P/G Hostel</option>
                                    <option value="Home Stay">Home Stay</option>
                                    <option value="Dormitory">Dormitory</option>
                                </select>
                            </div>

                            {/* Rent Type Filter */}
                            <div className="form-group">
                                <label>Rent Type</label>
                                <select
                                    name="rentType"
                                    value={filters.rentType}
                                    onChange={handleFilterChange}
                                    className="filter-select"
                                >
                                    <option value="">All Types</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Lease">Lease</option>
                                </select>
                            </div>

                            {/* Location Filter */}
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="Enter location"
                                    className="filter-input"
                                />
                            </div>

                            {/* Created By Filter */}
                            <div className="form-group">
                                <label>Created By</label>
                                <input
                                    type="text"
                                    name="createdBy"
                                    value={filters.createdBy}
                                    onChange={handleFilterChange}
                                    placeholder="Enter created by name"
                                    className="filter-input"
                                />
                            </div>

                            {/* Created At */}
                            <div className="form-group">
                                <label>Created At</label>
                                <input
                                    type="date"
                                    name="createdAt"
                                    value={filters.createdAt || ''}
                                    onChange={(e) => {
                                        const newInputValue = e.target.value;
                                        setFilters(prev => ({
                                            ...prev,
                                            createdAt: newInputValue,
                                            page: 1
                                        }));
                                    }}
                                    className="filter-input"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">❌ {error}</div>}

                    {properties.length === 0 ? (
                        <div className="no-data">
                            <p>📭 No properties found</p>
                        </div>
                    ) : (
                        <div className="properties-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>S.I No</th>
                                        <th>Property ID</th>
                                        <th>Image</th>
                                        <th>BHK</th>
                                        <th>Floor</th>
                                        <th>Property Mode</th>
                                        <th>Property Type</th>
                                        <th>Rent Type</th>
                                        <th>Amount</th>
                                        <th>Street</th>
                                        <th>Location</th>
                                        <th>URL</th>
                                        <th>Phone</th>
                                        <th>Masked Phone</th>
                                        <th>Advance</th>
                                        <th>Created At</th>
                                        <th>Created By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map((property, index) => (
                                        <tr key={property._id}>
                                            <td className="serial-number">{index + 1}</td>
                                            <td>
                                                <span className="property-id">
                                                    {property.propertyId || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                {property.images && property.images.length > 0 && property.images[tableImageIndices[property._id] || 0]?.url ? (
                                                    <div className="table-image-container">
                                                        <img
                                                            src={`${process.env.REACT_APP_MEDIA_URL}${property.images[tableImageIndices[property._id] || 0]?.url}`}
                                                            alt="Property"
                                                            className="table-image table-image-clickable"
                                                            onClick={() => handleImageClick(property, tableImageIndices[property._id] || 0)}
                                                            title="Click to view all images"
                                                        />
                                                        {property.images.length > 1 && (
                                                            <span className="image-counter-badge">
                                                                {(tableImageIndices[property._id] || 0) + 1}/{property.images.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="no-image-small">📷 No Image</div>
                                                )}
                                            </td>
                                            <td>{property.bhk || 'N/A'}</td>
                                            <td>{property.floor || 'N/A'}</td>
                                            <td>
                                                <span className={`badge badge-${property.propertyMode.toLowerCase()}`}>
                                                    {property.propertyMode}
                                                </span>
                                            </td>
                                            <td>{property.propertyType || '-'}</td>
                                            <td>{property.rentType || '-'}</td>
                                            <td>₹{property.rentAmount || property.leaseAmount || '-'}</td>
                                            <td>{property.streetName}</td>
                                            <td>{property.location}</td>
                                            <td>
                                                {property.url ? (
                                                    <a href={property.url} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', textDecoration: 'underline', cursor: 'pointer'}}>
                                                        🔗 View
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td>{property.phoneNumber}</td>
                                            <td>{getMaskedPhoneNumber(property.phoneNumber)}</td>
                                            <td>₹{property.advanceAmount || '-'}</td>
                                            <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className="created-by-badge">
                                                    {property.createdBy || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn btn-edit"
                                                        onClick={() => handleEdit(property)}
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        className="btn btn-delete"
                                                        onClick={() => handleDelete(property._id)}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="btn btn-secondary"
                            >
                                ← Previous
                            </button>
                            <span className="page-info">
                                Page {filters.page} of {totalPages}
                            </span>
                            <button 
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === totalPages}
                                className="btn btn-secondary"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* IMAGE LIGHTBOX GALLERY MODAL */}
            {selectedImage && selectedImage.images && selectedImage.images.length > 0 && (
                <div className="image-lightbox-overlay" onClick={handleCloseImageModal}>
                    <div className="image-lightbox-container" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button 
                            className="lightbox-close-btn"
                            onClick={handleCloseImageModal}
                            title="Close"
                        >
                            ✕
                        </button>

                        {/* Main Image Display */}
                        <div className="lightbox-image-wrapper">
                            {selectedImage?.images?.[selectedImageIndex]?.url ? (
                                <img 
                                    src={`${process.env.REACT_APP_MEDIA_URL}${selectedImage.images[selectedImageIndex].url}`}
                                    alt={`Property ${selectedImageIndex + 1}`}
                                    className="lightbox-image" 
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Image not available</div>
                            )}
                        </div>

                        {/* Navigation Arrows (only show if multiple images) */}
                        {selectedImage.images.length > 1 && (
                            <>
                                <button
                                    className="lightbox-nav-btn lightbox-prev-btn"
                                    onClick={handlePreviousImage}
                                    title="Previous image"
                                >
                                    ❮
                                </button>
                                <button
                                    className="lightbox-nav-btn lightbox-next-btn"
                                    onClick={handleNextImage}
                                    title="Next image"
                                >
                                    ❯
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        {selectedImage.images.length > 1 && (
                            <div className="lightbox-counter">
                                {selectedImageIndex + 1} / {selectedImage.images.length}
                            </div>
                        )}

                        {/* Thumbnail Strip */}
                        {selectedImage?.images?.length > 1 && (
                            <div className="lightbox-thumbnails">
                                {selectedImage.images.filter(img => img?.url).map((img, index) => (
                                    <img
                                        key={index}
                                        src={`${process.env.REACT_APP_MEDIA_URL}${img.url}`}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`lightbox-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                                        onClick={() => setSelectedImageIndex(index)}
                                        title={`Image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Info Text */}
                        <div className="lightbox-info">
                            <p>💡 Use arrows or click thumbnails to browse • Click ✕ or outside to close</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
