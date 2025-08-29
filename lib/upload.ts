// Utility function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Upload image to Supabase Storage
export const uploadImage = async (file: File, bucket: string = 'images'): Promise<string> => {
  try {
    // For now, we'll convert to base64 and store it directly
    // In production, you'd want to use Supabase Storage
    const base64 = await fileToBase64(file)
    return base64
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please select a valid image file (JPEG, PNG, or WebP)' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' }
  }
  
  return { valid: true }
}
