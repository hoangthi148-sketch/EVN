// Lịch cắt điện: lấy dữ liệu từ /api/npc/outage/{account} và hiển thị trong #outageCard
(function () {
    'use strict';

    const REFRESH_MS = 10 * 60 * 1000;
    let lastAccount = null;

    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function baseUrl() {
        const m = window.location.pathname.match(/\/api\/hassio_ingress\/[^\/]+/);
        return m ? m[0] : '';
    }

    function currentAccount() {
        const select = document.getElementById('accountSelect');
        return select && select.value ? select.value : '';
    }

    function injectStyle() {
        if (document.getElementById('outageStyle')) return;
        const style = document.createElement('style');
        style.id = 'outageStyle';
        style.textContent = [
            '.outage-item{border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 10px;margin-bottom:8px}',
            '.outage-item.ongoing{border-color:#ef4444;background:rgba(239,68,68,.12)}',
            '.outage-area{font-weight:600}',
            '.outage-time{font-size:1.05rem;font-weight:700;margin:2px 0}',
            '.outage-date{opacity:.75;font-size:.8rem}',
            '.outage-reason{opacity:.8;font-size:.8rem;white-space:pre-line;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer;margin-top:4px}',
            '.outage-reason.open{-webkit-line-clamp:unset;display:block}',
            '.outage-tag{display:inline-block;font-size:.7rem;font-weight:700;padding:1px 6px;border-radius:999px;margin-left:6px;background:#ef4444;color:#fff}',
            '.outage-ok{color:#22c55e}',
            '.outage-past summary{cursor:pointer;opacity:.8;font-size:.8rem;margin:4px 0 8px}'
        ].join('');
        document.head.appendChild(style);
    }

    function itemHtml(e) {
        const time = e.to ? esc(e.from) + ' → ' + esc(e.to) : esc(e.from);
        return '<div class="outage-item' + (e.ongoing ? ' ongoing' : '') + '">' +
            '<div class="outage-area">' + esc(e.area || 'Không rõ khu vực') +
            (e.ongoing ? '<span class="outage-tag">ĐANG CẮT</span>' : '') + '</div>' +
            '<div class="outage-time">' + time + '</div>' +
            '<div class="outage-date">' + esc(e.date) + '</div>' +
            (e.reason ? '<div class="outage-reason">' + esc(e.reason) + '</div>' : '') +
            '</div>';
    }

    function render(data) {
        const list = document.getElementById('outageList');
        const badge = document.getElementById('outageBadge');
        const pastBox = document.getElementById('outagePast');
        if (!list) return;

        const upcoming = data.upcoming || [];
        const past = data.past || [];

        if (badge) {
            badge.textContent = upcoming.length ? upcoming.length + ' lịch' : '';
        }
        list.innerHTML = upcoming.length
            ? upcoming.map(itemHtml).join('')
            : '<div class="outage-ok"><i class="fas fa-check-circle"></i> Không có lịch cắt điện sắp tới</div>';

        if (pastBox) {
            if (past.length) {
                pastBox.style.display = '';
                pastBox.innerHTML = '<summary>Đã diễn ra gần đây (' + past.length + ')</summary>' + past.map(itemHtml).join('');
            } else {
                pastBox.style.display = 'none';
            }
        }

        document.querySelectorAll('#outageCard .outage-reason').forEach(function (el) {
            el.addEventListener('click', function () { el.classList.toggle('open'); });
        });
    }

    async function load() {
        const account = currentAccount();
        const list = document.getElementById('outageList');
        if (!account || !list) return;
        lastAccount = account;
        try {
            const resp = await fetch(baseUrl() + '/api/npc/outage/' + encodeURIComponent(account));
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            if (data.error) throw new Error(data.error);
            render(data);
        } catch (err) {
            console.error('Lỗi tải lịch cắt điện:', err);
            list.innerHTML = '<div style="opacity:.7">Không tải được lịch cắt điện.</div>';
        }
    }

    function init() {
        injectStyle();

        // Chờ danh sách tài khoản được nạp xong rồi mới tải lịch
        let tries = 0;
        const timer = setInterval(function () {
            tries += 1;
            if (currentAccount()) {
                clearInterval(timer);
                load();
            } else if (tries > 60) {
                clearInterval(timer);
            }
        }, 500);

        const select = document.getElementById('accountSelect');
        if (select) select.addEventListener('change', load);

        setInterval(function () {
            if (currentAccount() === lastAccount) load();
        }, REFRESH_MS);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
