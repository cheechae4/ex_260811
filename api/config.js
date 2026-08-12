/* Vercel 서버리스 함수: /api/config
 * Supabase 접속 정보를 빌드에 포함시키지 않고, 요청 시점에 Vercel 환경변수에서 읽어
 * window.SUPABASE_URL / window.SUPABASE_ANON_KEY 로 내려준다.
 *
 * Vercel 대시보드 → 이 프로젝트 → Settings → Environment Variables 에 아래 두 값을 등록할 것:
 *   SUPABASE_URL       예) https://xxxxxxxx.supabase.co
 *   SUPABASE_ANON_KEY   Supabase 프로젝트의 anon public key
 * (anon key는 supabase/schema.sql의 RLS 정책으로 insert만 허용되므로 공개되어도 안전하다.
 *  그래도 굳이 git에 남기지 않고 싶다는 요청에 따라 여기서는 환경변수로만 주입한다.)
 */
module.exports = (req, res) => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || '';
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).send(
    `window.SUPABASE_URL = ${JSON.stringify(url)};\n` +
    `window.SUPABASE_ANON_KEY = ${JSON.stringify(key)};\n`
  );
};
