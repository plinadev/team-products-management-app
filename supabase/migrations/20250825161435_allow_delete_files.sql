create policy "Allow authenticated delete"
on storage.objects
for delete
using (auth.role() = 'authenticated');
