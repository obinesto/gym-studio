// Keep the full video for seven days. Cache Storage does not expire entries itself.
const VIDEO_CACHE_NAME = 'training-studio-video-v1';
const VIDEO_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

async function prepareHeroVideo() {
    const video = document.getElementById('hero-video');
    const controller = new AbortController();
    let objectUrl;
    const downloadTimer = setTimeout(() => controller.abort(), 120000);

    window.addEventListener('pagehide', () => {
        controller.abort();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
    }, { once: true });

    try {
        const videoUrl = new URL(video.dataset.src, document.baseURI).href;
        let cache;
        let response;
        try {
            cache = await caches.open(VIDEO_CACHE_NAME);
            const cached = await cache.match(videoUrl);
            const savedAt = Number(cached?.headers.get('X-Video-Cached-At'));
            if (cached && savedAt > 0 && savedAt <= Date.now() && Date.now() - savedAt < VIDEO_CACHE_TTL) {
                response = cached;
            } else if (cached) {
                await cache.delete(videoUrl);
            }
        } catch {
            // Storage can be unavailable or full. The download can still proceed.
        }

        if (controller.signal.aborted) return;
        if (!response) {
            video.poster = video.dataset.poster;
            response = await fetch(videoUrl, { signal: controller.signal, cache: 'no-store' });
            if (!response.ok) throw new Error('Video download failed');
            const blob = await response.blob();
            response = new Response(blob, {
                headers: {
                    'Content-Type': 'video/mp4',
                    'X-Video-Cached-At': String(Date.now())
                }
            });
            if (cache) {
                // A storage failure must not prevent the site from opening.
                cache.put(videoUrl, response.clone()).catch(() => { });
            }
        }

        const blob = await response.blob();
        if (controller.signal.aborted) return;
        clearTimeout(downloadTimer);
        objectUrl = URL.createObjectURL(blob);
        video.addEventListener('loadeddata', () => {
            video.play().catch(() => { });
        }, { once: true });
        video.addEventListener('error', () => {
            video.poster = video.dataset.poster;
            video.removeAttribute('src');
            video.load();
        }, { once: true });
        video.src = objectUrl;
        video.load();
    } catch {
        // Use the fallback only for a cache miss or an unusable video.
        video.poster = video.dataset.poster;
    } finally {
        clearTimeout(downloadTimer);
    }
}

prepareHeroVideo();
