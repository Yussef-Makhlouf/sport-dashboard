'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface MemberData {
  name: {
    ar: string;
    en: string;
  };
  image: {
    secure_url: string;
    public_id: string;
  };
  position: {
    ar: string;
    en: string;
  };
  _id: string;
  customId: string;
}

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [formData, setFormData] = useState({
    name: {
      ar: '',
      en: '',
    },
    position: {
      ar: '',
      en: '',
    },
    image: {
      secure_url: '',
      public_id: '',
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/getmemberbyid/${params.id}`);
        const data = await response.json();
        
        if (data.member) {
          setMemberData(data.member);
          setFormData({
            name: data.member.name,
            position: data.member.position,
            image: data.member.image,
          });
          setPreviewUrl(data.member.image.secure_url);
        }
      } catch (error) {
        // toast.error('Failed to fetch member data');
        console.error('Error fetching member:', error);
      }
    };

    fetchMember();
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleInputChange = (field: string, lang: 'ar' | 'en', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev],
        [lang]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageData = formData.image;

      if (selectedFile) {
        const formDataImage = new FormData();
        formDataImage.append('file', selectedFile);
        
        // Upload image first
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          body: formDataImage,
        });
        
        const uploadData = await uploadResponse.json();
        if (uploadData.secure_url) {
          imageData = {
            secure_url: uploadData.secure_url,
            public_id: uploadData.public_id
          };
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // toast.success('Member updated successfully');
        router.push('/dashboard/members');
      } else {
        // toast.error(data.message || 'Failed to update member');
      }
    } catch (error) {
    //   toast.error('An error occurred while updating the member');
      console.error('Error updating member:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!memberData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Member</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name (Arabic)</label>
            <input
              type="text"
              value={formData.name.ar}
              onChange={(e) => handleInputChange('name', 'ar', e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name (English)</label>
            <input
              type="text"
              value={formData.name.en}
              onChange={(e) => handleInputChange('name', 'en', e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Position (Arabic)</label>
            <input
              type="text"
              value={formData.position.ar}
              onChange={(e) => handleInputChange('position', 'ar', e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Position (English)</label>
            <input
              type="text"
              value={formData.position.en}
              onChange={(e) => handleInputChange('position', 'en', e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            {previewUrl && (
              <div className="mb-4">
                <img 
                  src={previewUrl} 
                  alt="Member preview" 
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload New Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium mb-2">Or Enter Image URL</label>
                <input
                  type="text"
                  value={formData.image.secure_url}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      image: { ...prev.image, secure_url: e.target.value }
                    }));
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full p-2 border rounded-md"
                />
              </div> */}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Member'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/dashboard/members')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
