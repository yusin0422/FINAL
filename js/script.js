window.addEventListener('scroll', () => {
			const flexContainer = document.querySelector('.flex');
			if (!flexContainer) return;

			const rect = flexContainer.getBoundingClientRect();
			const windowHeight = window.innerHeight;

	
			const startY = windowHeight * 0.6; 
		
			const endY = -windowHeight * 1.5;   
			const totalRange = startY - endY;

			
			let progress = (startY - rect.top) / totalRange;
			progress = Math.min(Math.max(progress, 0), 1); 

			const leftP = flexContainer.querySelector('p:nth-of-type(1)');
			const rightP = flexContainer.querySelector('p:nth-of-type(2)');

			if (leftP && rightP) {
			
				const maxLeftMove = 350;  
				const maxRightMove = 2000;

				leftP.style.transform = `translateY(${progress * maxLeftMove}px)`;
				rightP.style.transform = `translateY(${progress * maxRightMove}px)`;
			}
		});


	window.addEventListener('scroll', () => {

    const chapters = [
        document.getElementById('chapter1'),
        document.getElementById('chapter2'),
        document.getElementById('chapter3'),
        document.getElementById('chapter4'),
        document.getElementById('chapter5')
    ];
   
    const navItems = document.querySelectorAll('.right-scroll-nav li');
    
    let currentActiveIndex = 0;
 
    const scrollPosition = window.scrollY + (window.innerHeight * 0.3);

    chapters.forEach((chapter, index) => {
        if (chapter) {
            const chapterTop = chapter.offsetTop;
 
            if (scrollPosition >= chapterTop) {
                currentActiveIndex = index;
            }
        }
    });

    // 4. 기존 active 다 압수하고, 현재 챕터에 해당하는 녀석에게만 active 완장 채워주기
    navItems.forEach((item, index) => {
        if (index === currentActiveIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 일반 등장 요소들 (위치 이동 + 투명도 동시 제어)
    // ⚠️ 문제가 되었던 '.flex'를 여기서 과감히 제외했습니다.
    const normalTargets = document.querySelectorAll([
        'h1', 'h2', '.archnum',
        '.title p', '.content p', '.quotes p', '.lastquotes p', '.next-paragraph-box p',
        'img:not(.coverimg)'
    ].join(', '));

    normalTargets.forEach(el => el.classList.add('scroll-fade'));

    // 2. 주인님의 시차 이동이 살아 숨쉬는 .flex 내부의 p 태그들 (투명도만 제어)
    const flexParagraphs = document.querySelectorAll('.flex p');
    flexParagraphs.forEach(el => el.classList.add('scroll-fade-opacity'));

    // 3. 정확히 화면 4분의 1 지점을 감시하는 통합 인터섹션 옵저버 시동
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-shown');
                scrollObserver.unobserve(entry.target); // 등장하면 감시 해제하여 연산 최적화
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -25% 0px', // 정확히 화면 밑바닥에서 25% 올라온 커트라인
        threshold: 0.01
    });

    // 4. 두 그룹 모두에게 감시 핀 꽂기
    normalTargets.forEach(el => scrollObserver.observe(el));
    flexParagraphs.forEach(el => scrollObserver.observe(el));
});


window.addEventListener('scroll', () => {
    const wrapper = document.querySelector('.img-wrapper-14');
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    // 박스가 화면 하단에 등장해서 화면 상단으로 완전히 사라질 때까지의 전체 가시 영역 계산
    const startScroll = rect.top - viewHeight;
    const endScroll = rect.bottom;
    const totalDuration = viewHeight + rect.height;
    
    // 현재 스크롤 진행도 (0 ~ 1 사이의 소수점)
    const progress = Math.min(Math.max(-startScroll / totalDuration, 0), 1);

    // 박스가 화면에 보이고 있을 때만 3등분해서 좌표 스위칭
    if (progress > 0 && progress < 1) {
        if (progress < 0.33) {
            wrapper.classList.add('step-1');
            wrapper.classList.remove('step-2', 'step-3');
        } else if (progress < 0.66) {
            wrapper.classList.add('step-2');
            wrapper.classList.remove('step-1', 'step-3');
        } else {
            wrapper.classList.add('step-3');
            wrapper.classList.remove('step-1', 'step-2');
        }
    }
});

window.addEventListener('scroll', () => {
    const wrapper = document.querySelector('.scroll-wrapper');
    const texts = document.querySelectorAll('.fade-text');
    const image = document.getElementById('moving-image');
    
    // 1. 스크롤 진행률 계산 (0 ~ 1)
    const rect = wrapper.getBoundingClientRect();
    const totalHeight = wrapper.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));

    // 2. 이미지 이동 (0% ~ 80% 좌측->우측)
    // progress가 1일 때 화면 끝까지 이동
const imgX = progress * (window.innerWidth * 0.3); 
image.style.left = `${imgX}px`;

    // 3. 텍스트 페이드 효과 (진행률에 따라 하나씩 보여주기)
    texts.forEach((text, index) => {
        // 구간 나누기 (3개의 문단이므로 0~0.33, 0.33~0.66, 0.66~1)
        const start = index / texts.length;
        const end = (index + 0.8) / texts.length;
        
        if (progress >= start && progress < end) {
            text.style.opacity = '1';
        } else {
            text.style.opacity = '0';
        }
    });
});


window.addEventListener('scroll', () => {
    const storySections = document.querySelectorAll('.story-section');
    
    storySections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const totalHeight = section.offsetHeight - window.innerHeight;
        
        // 현재 섹션의 스크롤 트랙 진행률 (0 ~ 1)
        let progress = -rect.top / totalHeight;
        progress = Math.max(0, Math.min(1, progress));

        // 1번째 섹션 (뗏목)
        if (index === 0) {
            const text = section.querySelector('.text-1-1');
            const img = section.querySelector('.img-1-1');
            if (text) text.style.opacity = Math.max(0, Math.min(1, progress * 2));
            if (img) img.style.opacity = Math.max(0, Math.min(1, (progress - 0.4) * 2));
        }
        
        // 2번째 섹션 (나우시카)
        else if (index === 1) {
            const text1 = section.querySelector('.text-2-1');
            const img = section.querySelector('.img-2-1');
            const text2 = section.querySelector('.text-2-2');

            if (progress < 0.3) {
                if (text1) text1.style.opacity = progress * 3.3;
                if (img) img.style.opacity = 0;
                if (text2) text2.style.opacity = 0;
            } else if (progress >= 0.3 && progress < 0.5) {
                if (text1) text1.style.opacity = (0.5 - progress) * 5;
                if (img) img.style.opacity = 0;
                if (text2) text2.style.opacity = 0;
            } else {
                if (text1) text1.style.opacity = 0;
                if (img) img.style.opacity = (progress - 0.5) * 2;
                if (text2) text2.style.opacity = (progress - 0.5) * 2;
            }
        }
        
        // 3번째 섹션 (이타카)
        else if (index === 2) {
            const img = section.querySelector('.img-3-1');
            const text = section.querySelector('.text-3-1');
            if (img) img.style.opacity = Math.max(0, Math.min(1, progress * 2));
            if (text) text.style.opacity = Math.max(0, Math.min(1, (progress - 0.4) * 2));
        }
    });
});