
-- Create storage bucket for plant images
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload plant images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'plant-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own plant images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'plant-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own plant images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'plant-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access for plant images
CREATE POLICY "Public can view plant images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'plant-images');
