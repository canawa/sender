import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://eddnkmvlagibcvzmmgeu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZG5rbXZsYWdpYmN2em1tZ2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzE2MzcsImV4cCI6MjA1ODE0NzYzN30.cI8b0epxKevEvBj1ioEXt8LwWJtQu5-YTrKUt7H7tkQ';
const TELEGRAM_TOKEN = '7631558170:AAGGhh10UuegU3XVA06e9hmL__CxXWqTy4Q';
const CHAT_ID = '1015628413';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sendTelegramMessage(message) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const fullUrl = `${url}?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
    
    console.log('Attempting to send message:', fullUrl);
    
    const response = await fetch(fullUrl);
    const data = await response.json();
    
    console.log('Telegram API Response:', JSON.stringify(data, null, 2));
    
    if (data.ok) {
      console.log('Message sent successfully to Telegram');
    } else {
      console.error('Failed to send message:', data.description);
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

let lastCheckedId = 0;  // Вынес за пределы функции, чтобы сохранялось состояние

async function checkNewRows() {
  try {
    const { data, error } = await supabase
      .from('info')
      .select('*')
      .gt('id', lastCheckedId)
      .order('id', { ascending: true });

    console.log('Supabase Query Results:', { data, error });

    if (error) {
      console.error('Supabase Query Error:', error);
      return;
    }

    if (data && data.length > 0) {
      data.forEach(row => {
        const message = `⚡ Новая заявка:\n\n👨Имя: ${row.name}\n\n☎️ Телефон: ${row.phone}\n\n💖Описание: ${row.message || 'Нет описания'}`;
        sendTelegramMessage(message);
      });

      lastCheckedId = data[data.length - 1].id; // Обновляем lastCheckedId
    }
  } catch (error) {
    console.error('Unexpected error in checkNewRows:', error);
  }
}

// Запускаем проверку каждые 5 секунд
setInterval(checkNewRows, 10000);
const { data, error } = await supabase
  .from('info')
  .select('*')
  .order('id', { ascending: true });

console.log(data, error);

console.log('SERVER RUNNING!!!');


