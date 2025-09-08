import { createClient } from '@supabase/supabase-js';

// Thay thế các giá trị này bằng thông tin từ dự án Supabase của bạn
const supabaseUrl = 'https://qzlhdsmfsbwsjgqphnex.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bGhkc21mc2J3c2pncXBobmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwODE2MDYsImV4cCI6MjA3MjY1NzYwNn0.R-B7j0AS3_sdeih0aMJKwhuNUO-KRI07r2mZGhRc7aM';

// Khởi tạo client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
