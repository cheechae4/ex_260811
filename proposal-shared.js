/* 세 프로포즈 페이지(propose.html / propose-cute.html / propose-minimal.html)가
 * 공유하는 Supabase 저장 로직. 각 페이지는 자기 디자인에 맞는 날짜 팝업 마크업만 갖고,
 * 제출 시 이 파일의 submitProposalResponse()를 호출한다.
 */
(function () {
  const READY = (async () => {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      console.warn('[proposal] supabase-config.js가 없어서 응답이 저장되지 않습니다. supabase-config.example.js를 참고하세요.');
      return null;
    }
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    return createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  })();

  /* 결혼식 날짜(YYYY-MM-DD)와 오늘(이용일) 사이의 일수 차이. 자정 기준 UTC 계산으로 시간대 오차를 없앤다. */
  function daysUntil(weddingDateStr) {
    const used = new Date();
    const usedUTC = Date.UTC(used.getFullYear(), used.getMonth(), used.getDate());
    const [y, m, d] = weddingDateStr.split('-').map(Number);
    const weddingUTC = Date.UTC(y, m - 1, d);
    return Math.round((weddingUTC - usedUTC) / 86400000);
  }

  /**
   * @param {{groom:string, bride:string, weddingDate:string, isTentative:boolean, pageVersion:string}} p
   * @returns {Promise<{ok:boolean, error?:any}>}
   */
  async function submitProposalResponse(p) {
    const row = {
      groom_name: p.groom,
      bride_name: p.bride,
      wedding_date: p.weddingDate,
      date_is_tentative: !!p.isTentative,
      days_until_wedding: daysUntil(p.weddingDate),
      page_version: p.pageVersion,
    };
    try {
      const supabase = await READY;
      if (!supabase) return { ok: false, error: 'no-config' };
      const { error } = await supabase.from('proposal_responses').insert(row);
      if (error) throw error;
      return { ok: true };
    } catch (error) {
      console.error('[proposal] 저장 실패:', error);
      return { ok: false, error };
    }
  }

  window.ProposalShared = { submitProposalResponse, daysUntil };
})();
