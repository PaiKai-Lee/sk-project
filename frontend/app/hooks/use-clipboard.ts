import { useState, useCallback, type RefObject, useRef, useEffect } from "react";
import { toBlob } from "html-to-image";

export type ClipboardStatus = 'initial' | 'pending';

export function useImageClipboard(
    ref: RefObject<HTMLDivElement | null>,
    options?: {
        onSuccess?: () => void;
        onError?: (error: unknown) => void;
    }
) {
    const [status, setStatus] = useState<ClipboardStatus>('initial');

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [])

    const imageClipboard = useCallback(async () => {
        if (!ref?.current || status !== 'initial') return;
        setStatus('pending');
        const element = ref.current;
        try {
            const PADDING = 16;
            const originalWidth = element.offsetWidth;
            const originalHeight = element.offsetHeight;
            const blob = await toBlob(element, {
                cacheBust: true,
                width: originalWidth + PADDING * 2,
                height: originalHeight + PADDING * 2,
                style: {
                    padding: `${PADDING}px`,
                    borderRadius: '8px',
                }
            });
            if (!blob) throw new Error('blob is null');
            // 檢查瀏覽器支援度
            if (!window.ClipboardItem) {
                throw new Error('Your browser does not support ClipboardItem API');
            }
            const clipboardItem = new ClipboardItem({
                [blob.type]: blob,
            });
            await navigator.clipboard.write([clipboardItem]);
            options?.onSuccess?.();
        } catch (err) {
            console.error('Clipboard Error:', err);
            options?.onError?.(err);
        } finally {
            timerRef.current = setTimeout(() => setStatus('initial'), 500);
        }
    }, [ref, status]);

    return { imageClipboard, status };
}