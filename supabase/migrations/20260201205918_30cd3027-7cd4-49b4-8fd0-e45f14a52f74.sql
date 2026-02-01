-- Create storage bucket for referral screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('referral-screenshots', 'referral-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload referral screenshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'referral-screenshots');

-- Allow authenticated users to view files
CREATE POLICY "Authenticated users can view referral screenshots"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'referral-screenshots');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update referral screenshots"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'referral-screenshots');

-- Allow admins to delete files
CREATE POLICY "Admins can delete referral screenshots"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'referral-screenshots' AND public.has_role(auth.uid(), 'admin'));