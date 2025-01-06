document.addEventListener('DOMContentLoaded', function() {
    // 브밀번호 확인
    function checkPassword() {
        const password = prompt('비밀번호를 입력해주세요:');
        if (password !== '1234') {
            alert('비밀번호가 올바르지 않습니다.');
            document.body.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h1>접근 제한</h1>
                    <p>올바른 비밀번호를 입력해야 접근이 가능합니다.</p>
                    <button onclick="location.reload()">다시 시도</button>
                </div>
            `;
            return false;
        }
        return true;
    }

    // 비밀번호 확인 실행
    if (!checkPassword()) return;

    // 브라우저 및 디바이스 체크
    function checkBrowserAndDevice() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|OPR\/|Whale/i.test(navigator.userAgent);
        
        if (!isMobile || !isChrome) {
            document.body.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h1>알림</h1>
                    <p>이 웹사이트는 모바일 크롬 브라우저에 최적화되어 있습니다.</p>
                    <p>모바일 기기의 크롬 브라우저로 접속해 주세요.</p>
                </div>
            `;
            return false;
        }
        return true;
    }

    // 브라우저/디바이스 체크 실행
    if (!checkBrowserAndDevice()) return;

    // 초기 쿠폰 데이터
    const initialCoupons = [
        'LOVE01', 'LOVE02', 'LOVE03', 'LOVE04', 'LOVE05',
        'LOVE06', 'LOVE07', 'LOVE08', 'LOVE09', 'LOVE10',
        'LOVE11', 'LOVE12', 'LOVE13', 'LOVE14', 'LOVE15',
        'LOVE16', 'LOVE17', 'LOVE18', 'LOVE19', 'LOVE20',
        'LOVE21', 'LOVE22', 'LOVE23', 'LOVE24', 'LOVE25',
        'LOVE26', 'LOVE27', 'LOVE28', 'LOVE29', 'LOVE30'
    ];

    // 로컬 스토리지에서 쿠폰 데이터 가져오기 또는 초기화
    let availableCoupons;
    try {
        if (!localStorage.getItem('coupons')) {
            localStorage.setItem('coupons', JSON.stringify(initialCoupons));
        }
        availableCoupons = JSON.parse(localStorage.getItem('coupons'));
    } catch (error) {
        console.error('로컬 스토리지 초기화 중 오류:', error);
        availableCoupons = [...initialCoupons];
    }

    const couponInput = document.getElementById('couponCode');
    const submitButton = document.getElementById('submitCoupon');
    const resultDiv = document.getElementById('result');

    submitButton.addEventListener('click', handleCouponSubmit);
    couponInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleCouponSubmit();
        }
    });

    function handleCouponSubmit() {
        const code = couponInput.value.trim().toUpperCase();
        
        if (code === '') {
            showResult('쿠폰 코드를 입력해주세요.', false);
            return;
        }

        // 쿠폰 코드 형식 검증
        if (!code.match(/^LOVE(0[1-9]|[12][0-9]|30)$/)) {
            showResult('올바른 쿠폰 형식이 아닙니다.', false);
            return;
        }

        const couponIndex = availableCoupons.indexOf(code);
        if (couponIndex !== -1) {
            try {
                // 쿠폰이 존재하는 경우
                availableCoupons.splice(couponIndex, 1);
                localStorage.setItem('coupons', JSON.stringify(availableCoupons));
                
                let message = '';
                const codeNumber = parseInt(code.replace('LOVE', ''));
                
                if (codeNumber >= 1 && codeNumber <= 15) {
                    message = '안마 쿠폰이 사용되었습니다. 10분 내로 출동해 주십시오!';
                } else if (codeNumber >= 16 && codeNumber <= 25) {
                    message = '집안일 쿠폰이 사용되었습니다. 10분내로 출동해 주십시오!';
                } else if (codeNumber >= 26 && codeNumber <= 30) {
                    message = '화풀기 쿠폰이 사용되었습니다. 10분안에 화를 풀어 주시기 바랍니다!';
                }

                // SMS 링크 생성 및 클릭
                const phoneNumber = '01068577428';
                const smsLink = document.createElement('a');
                smsLink.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
                document.body.appendChild(smsLink);
                smsLink.click();
                document.body.removeChild(smsLink);

                showResult('쿠폰이 성공적으로 사용되었습니다!', true);
                couponInput.value = '';
            } catch (error) {
                console.error('쿠폰 처리 중 오류 발생:', error);
                showResult('쿠폰 처리 중 오류가 발생했습니다.', false);
            }
        } else {
            showResult('이미 사용되었거나 잘못된 쿠폰 코드입니다.', false);
        }
    }

    function showResult(message, isSuccess) {
        resultDiv.textContent = message;
        resultDiv.className = 'result-message ' + (isSuccess ? 'success' : 'error');
    }
});

// 모바일에서 더블탭 줌 방지
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });
