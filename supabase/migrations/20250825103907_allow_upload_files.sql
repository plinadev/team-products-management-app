create policy "Allow authenticated uploads"
on storage.objects
for insert
with check (auth.role() = 'authenticated');
