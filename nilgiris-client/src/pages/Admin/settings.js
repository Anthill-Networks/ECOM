import { useState, useEffect } from 'react';
import { Save, Upload, Edit2, X } from 'lucide-react';
import Sidebar from '../../components/admin/sidebar';
import { uploadImage } from '../../firebase/image';
import { saveSettings, getSettings } from '../../firebase/settingsService';
import { toast } from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';

export default function Settings() {
  const { settings: globalSettings, updateSettings: updateGlobalSettings, refetchSettings } = useSettings();
  
  const [settings, setSettings] = useState({
    storeName: '',
    email: '',
    phoneNumber: '',
    address: '',
    headerLogo: '',
    footerLogo: '',
    facebookAccount: '',
    instagramAccount: '',
    twitterAccount: '',
    homepageBanners: {
      desktop: [],
      mobile: []
    },
    testimonials: []
  });
  
  const [editingSections, setEditingSections] = useState({
    storeInfo: false,
    contact: false,
    social: false,
    banners: false,
    testimonials: false
  });
  
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState({
    headerLogo: false,
    footerLogo: false,
    banners: {
      desktop: [],
      mobile: []
    },
    testimonial: false
  });

  // Track which testimonial is being uploaded
  const [uploadingTestimonialIndex, setUploadingTestimonialIndex] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const existingSettings = await getSettings();
      if (existingSettings) {
        setSettings({
          ...settings,
          ...existingSettings,
          homepageBanners: {
            desktop: existingSettings.homepageBanners?.desktop || [],
            mobile: existingSettings.homepageBanners?.mobile || []
          },
          testimonials: existingSettings.testimonials || []
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error fetching settings');
    }
    setLoading(false);
  };

  const handleSaveSection = async (section) => {
    try {
      const success = await saveSettings(settings);
      if (success) {
        toast.success(`${section} settings saved successfully`);
        setEditingSections({ ...editingSections, [section]: false });
        updateGlobalSettings(settings);
        await refetchSettings();
      } else {
        toast.error(`Error saving ${section} settings`);
      }
    } catch (error) {
      toast.error(`Error saving ${section} settings`);
    }
  };

  const SectionHeader = ({ title, section }) => (
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center">
        {editingSections[section] ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveSection(section)}
              className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
            <button
              onClick={() => setEditingSections({ ...editingSections, [section]: false })}
              className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingSections({ ...editingSections, [section]: true })}
            className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </button>
        )}
      </div>
    </div>
  );

  const handleLogoUpload = async (e, type) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading({ ...uploading, [type]: true });
      const logoUrl = await uploadImage(file, `settings/${type}`);
      if (logoUrl) {
        setSettings({ ...settings, [type]: logoUrl });
        toast.success(`${type === 'headerLogo' ? 'Header' : 'Footer'} logo uploaded successfully`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Error uploading ${type}`);
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleBannerUpload = async (e, type) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      // Create temporary IDs for tracking uploads
      const uploadIds = files.map(() => Math.random().toString(36).substr(2, 9));
      
      // Add loading states for new uploads
      setUploading(prev => ({
        ...prev,
        banners: {
          ...prev.banners,
          [type]: [...prev.banners[type], ...uploadIds]
        }
      }));

      // Upload all files concurrently
      const uploadPromises = files.map(file => uploadImage(file, `settings/banners/${type}`));
      const uploadedUrls = await Promise.all(uploadPromises);

      // Update settings with new banner URLs
      setSettings(prev => ({
        ...prev,
        homepageBanners: {
          ...prev.homepageBanners,
          [type]: [...(prev.homepageBanners[type] || []), ...uploadedUrls]
        }
      }));

      toast.success('Banners uploaded successfully');
    } catch (error) {
      console.error('Error uploading banners:', error);
      toast.error('Error uploading banners');
    } finally {
      // Clear loading states
      setUploading(prev => ({
        ...prev,
        banners: {
          ...prev.banners,
          [type]: []
        }
      }));
    }
  };

  const handleTestimonialImageUpload = async (e, index) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading({ ...uploading, testimonial: true });
      setUploadingTestimonialIndex(index);
      
      const imageUrl = await uploadImage(file, 'settings/testimonials');
      if (imageUrl) {
        const updatedTestimonials = [...settings.testimonials];
        updatedTestimonials[index] = {
          ...updatedTestimonials[index],
          imageSrc: imageUrl
        };
        setSettings({ ...settings, testimonials: updatedTestimonials });
        toast.success('Testimonial image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading testimonial image:', error);
      toast.error('Error uploading testimonial image');
    } finally {
      setUploading({ ...uploading, testimonial: false });
      setUploadingTestimonialIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">General Site Settings</h1>
        
        <div className="space-y-6">
          {/* Store Info Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <SectionHeader title="Store Information" section="storeInfo" />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                {editingSections.storeInfo ? (
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full border rounded-md p-2"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded-md">{settings.storeName || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Header Logo</label>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 relative">
                    {uploading.headerLogo ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      settings.headerLogo && <img src={settings.headerLogo} alt="Header Logo" className="h-12 w-12 object-contain" />
                    )}
                  </div>
                  {editingSections.storeInfo && (
                    <label className="cursor-pointer bg-gray-100 p-2 rounded-md hover:bg-gray-200">
                      <Upload className="h-5 w-5" />
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleLogoUpload(e, 'headerLogo')} 
                        accept="image/*"
                        disabled={uploading.headerLogo} 
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo</label>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 relative">
                    {uploading.footerLogo ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      settings.footerLogo && <img src={settings.footerLogo} alt="Footer Logo" className="h-12 w-12 object-contain" />
                    )}
                  </div>
                  {editingSections.storeInfo && (
                    <label className="cursor-pointer bg-gray-100 p-2 rounded-md hover:bg-gray-200">
                      <Upload className="h-5 w-5" />
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleLogoUpload(e, 'footerLogo')} 
                        accept="image/*"
                        disabled={uploading.footerLogo} 
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <SectionHeader title="Contact Information" section="contact" />
            <div className="space-y-4">
              {['email', 'phoneNumber', 'address'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace('N', ' N')}
                  </label>
                  {editingSections.contact ? (
                    field === 'address' ? (
                      <textarea
                        value={settings[field]}
                        onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
                        className="w-full border rounded-md p-2"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={settings[field]}
                        onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
                        className="w-full border rounded-md p-2"
                      />
                    )
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md whitespace-pre-wrap">
                      {settings[field] || 'Not set'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <SectionHeader title="Social Media Links" section="social" />
            <div className="space-y-4">
              {['facebook', 'instagram', 'twitter'].map((platform) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)} Account
                  </label>
                  {editingSections.social ? (
                    <input
                      type="url"
                      value={settings[`${platform}Account`]}
                      onChange={(e) => setSettings({ ...settings, [`${platform}Account`]: e.target.value })}
                      className="w-full border rounded-md p-2"
                    />
                  ) : (
                    <a 
                      href={settings[`${platform}Account`]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-2 bg-gray-50 rounded-md text-blue-600 hover:underline"
                    >
                      {settings[`${platform}Account`] || 'Not set'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Banners Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <SectionHeader title="Homepage Banners" section="banners" />
            
            {/* Desktop Banners */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium">Desktop Banners (16:9)</h3>
                {uploading.banners.desktop.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    Uploading {uploading.banners.desktop.length} images...
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {settings.homepageBanners?.desktop?.map((banner, index) => (
                  <div key={index} className="relative aspect-video">
                    <img 
                      src={banner} 
                      alt={`Desktop Banner ${index + 1}`} 
                      className="w-full h-full object-cover rounded"
                    />
                    {editingSections.banners && (
                      <button
                        onClick={() => {
                          const newDesktopBanners = settings.homepageBanners.desktop.filter((_, i) => i !== index);
                          setSettings({
                            ...settings,
                            homepageBanners: {
                              ...settings.homepageBanners,
                              desktop: newDesktopBanners
                            }
                          });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {editingSections.banners && (
                  <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center hover:bg-gray-50">
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Images</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleBannerUpload(e, 'desktop')} 
                      accept="image/*"
                      multiple
                      disabled={uploading.banners.desktop.length > 0}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Mobile Banners */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium">Mobile Banners (9:16)</h3>
                {uploading.banners.mobile.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    Uploading {uploading.banners.mobile.length} images...
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {settings.homepageBanners?.mobile?.map((banner, index) => (
                  <div key={index} className="relative aspect-[9/16]">
                    <img 
                      src={banner} 
                      alt={`Mobile Banner ${index + 1}`} 
                      className="w-full h-full object-cover rounded"
                    />
                    {editingSections.banners && (
                      <button
                        onClick={() => {
                          const newMobileBanners = settings.homepageBanners.mobile.filter((_, i) => i !== index);
                          setSettings({
                            ...settings,
                            homepageBanners: {
                              ...settings.homepageBanners,
                              mobile: newMobileBanners
                            }
                          });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {editingSections.banners && (
                  <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg aspect-[9/16] flex flex-col items-center justify-center hover:bg-gray-50">
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Images</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleBannerUpload(e, 'mobile')} 
                      accept="image/*"
                      multiple
                      disabled={uploading.banners.mobile.length > 0}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <SectionHeader title="Testimonials" section="testimonials" />
            <div className="space-y-4">
              {(settings.testimonials || []).map((testimonial, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      {editingSections.testimonials ? (
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => {
                            const updated = [...settings.testimonials];
                            updated[index] = { ...testimonial, name: e.target.value };
                            setSettings({ ...settings, testimonials: updated });
                          }}
                          className="w-full border rounded-md p-2"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded-md">{testimonial.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                      {editingSections?.testimonials ? (
                        <input
                          type="text"
                          value={testimonial.designation}
                          onChange={(e) => {
                            const updated = [...settings.testimonials];
                            updated[index] = { ...testimonial, designation: e.target.value };
                            setSettings({ ...settings, testimonials: updated });
                          }}
                          className="w-full border rounded-md p-2"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded-md">{testimonial.designation}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                      {editingSections.testimonials ? (
                        <textarea
                          value={testimonial.quote}
                          onChange={(e) => {
                            const updated = [...settings.testimonials];
                            updated[index] = { ...testimonial, quote: e.target.value };
                            setSettings({ ...settings, testimonials: updated });
                          }}
                          className="w-full border rounded-md p-2"
                          rows="3"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded-md">{testimonial.quote}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 relative">
                          {uploadingTestimonialIndex === index ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            </div>
                          ) : testimonial.imageSrc ? (
                            <img src={testimonial.imageSrc} alt={testimonial.name} className="h-16 w-16 object-cover rounded" />
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                              <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        {editingSections.testimonials && (
                          <label className="cursor-pointer bg-gray-100 p-2 rounded-md hover:bg-gray-200">
                            <Upload className="h-5 w-5" />
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => handleTestimonialImageUpload(e, index)} 
                              accept="image/*"
                              disabled={uploading.testimonial}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  {editingSections.testimonials && (
                    <button
                      onClick={() => {
                        const updated = settings.testimonials.filter((_, i) => i !== index);
                        setSettings({ ...settings, testimonials: updated });
                      }}
                      className="mt-4 text-red-500 hover:text-red-600"
                    >
                      Remove Testimonial
                    </button>
                  )}
                </div>
              ))}
              {editingSections.testimonials && (
                <button
                  onClick={() => {
                    setSettings({
                      ...settings,
                      testimonials: [...(settings.testimonials || []), {
                        name: '',
                        designation: '',
                        quote: '',
                        imageSrc: ''
                      }]
                    });
                  }}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Add Testimonial
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 