// import axios from 'axios';

// export async function logAndSend(level: string, message: string) {
//   const timestamp = new Date().toISOString();

//   // Log ra console như bình thường
//   console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`);

//   // Gửi log lên Google Sheet
//   try {
//     await axios.post('https://api.sheetbest.com/sheets/971fb509-ee6c-47b8-a51c-43ddd96039c1', {
//       timestamp,
//       level,
//       message,
//     });
//   } catch (err) {
//     console.error('Lỗi gửi log lên Sheet:', err.message);
//   }
// }
