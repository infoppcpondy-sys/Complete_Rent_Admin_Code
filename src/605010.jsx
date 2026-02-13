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
    
    // Form data
    const [formData, setFormData] = useState({
        propertyMode: 'Rent',
        rentAmount: '',
        leaseAmount: '',
        advanceAmount: '',
        streetName: '',
        location: '',
        phoneNumber: ''
    });
    
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    
    // Filters
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        propertyMode: '',
        location: '',
        search: '',
        createdBy: '',
        createdDate: ''
    });
    const [totalPages, setTotalPages] = useState(1);

    // Redux & Role-Based Access Control
    const reduxAdminName = useSelector((state) => state.admin.name);
    const reduxAdminRole = useSelector((state) => state.admin.role);
    
    const adminName = reduxAdminName || localStorage.getItem("adminName");
    const adminRole = reduxAdminRole || localStorage.getItem("adminRole");
    
    const [allowedRoles, setAllowedRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    
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

    // Reset form
    const resetForm = () => {
        setFormData({
            propertyMode: 'Rent',
            rentAmount: '',
            leaseAmount: '',
            advanceAmount: '',
            streetName: '',
            location: '',
            phoneNumber: ''
        });
        setImages([]);
        setExistingImages([]);
        setIsEdit(false);
        setCurrentPropertyId(null);
        setShowForm(false);
        setError(null);
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
            propertyMode: property.propertyMode,
            rentAmount: property.rentAmount || '',
            leaseAmount: property.leaseAmount || '',
            advanceAmount: property.advanceAmount || '',
            streetName: property.streetName,
            location: property.location,
            phoneNumber: property.phoneNumber
        });
        setExistingImages(property.images || []);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle view property details
    const handleView = (property) => {
        setSelectedProperty(property);
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
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    // Remove existing image
    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
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
                <h1>🏠 Exclusive Location Property Management</h1>
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
                            {/* Property Mode */}
                            <div className="form-group">
                                <label>Property Mode *</label>
                                <select
                                    name="propertyMode"
                                    value={formData.propertyMode}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Rent">Rent</option>
                                    <option value="Lease">Lease</option>
                                    <option value="Sale">Sale</option>
                                </select>
                            </div>

                            {/* Rent Amount (only for Rent mode) */}
                            {formData.propertyMode === 'Rent' && (
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

                            {/* Lease Amount (only for Lease mode) */}
                            {formData.propertyMode === 'Lease' && (
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

                        {/* Upload New Images */}
                        <div className="form-group">
                            <label>{isEdit ? 'Add More Images' : 'Upload Images'}</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="file-input"
                            />
                            <small>You can select multiple images (Max 10)</small>
                            
                            {images.length > 0 && (
                                <div className="selected-files">
                                    <p>✅ Selected files: {images.length}</p>
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
                                        <th>Mode</th>
                                        <th>Amount</th>
                                        <th>Street</th>
                                        <th>Location</th>
                                        <th>Phone</th>
                                        <th>Advance</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map((property) => (
                                        <tr key={property._id}>
                                            <td>
                                                <span className={`badge badge-${property.propertyMode.toLowerCase()}`}>
                                                    {property.propertyMode}
                                                </span>
                                            </td>
                                            <td>₹{property.rentAmount || property.leaseAmount || '-'}</td>
                                            <td>{property.streetName}</td>
                                            <td>{property.location}</td>
                                            <td>{property.phoneNumber}</td>
                                            <td>₹{property.advanceAmount || '-'}</td>
                                            <td>{new Date(property.createdAt).toLocaleDateString()}</td>
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
                    )}

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
        </div>
    );
};

export default AdminDashboard;
