import { useEffect } from 'react';

/**
 * Automatically applies the Split Text Hover effect to text links across the website
 * while preserving icons, badges, and layout structure.
 */
export function useSplitTextLinks() {
  useEffect(() => {
    const applySplitText = (container: HTMLElement) => {
      const text = container.textContent || '';
      if (!text.trim() || container.querySelector('.split-text-wrapper')) return;

      container.dataset.splitTextProcessed = 'true';
      container.classList.add('split-text-wrapper');
      container.setAttribute('aria-label', text);
      container.innerHTML = '';

      const line1 = document.createElement('span');
      line1.className = 'split-text-line-1';
      line1.setAttribute('aria-hidden', 'true');

      const line2 = document.createElement('span');
      line2.className = 'split-text-line-2';
      line2.setAttribute('aria-hidden', 'true');

      const chars = text.split('');
      chars.forEach((char, index) => {
        const delay = `${Math.min(index * 16, 280)}ms`;

        const char1 = document.createElement('span');
        char1.className = 'split-text-char';
        char1.style.transitionDelay = delay;
        char1.textContent = char === ' ' ? '\u00A0' : char;
        line1.appendChild(char1);

        const char2 = document.createElement('span');
        char2.className = 'split-text-char';
        char2.style.transitionDelay = delay;
        char2.textContent = char === ' ' ? '\u00A0' : char;
        line2.appendChild(char2);
      });

      container.appendChild(line1);
      container.appendChild(line2);
    };

    const processLink = (link: HTMLElement) => {
      // Ignore non-applicable or already processed elements
      if (
        link.dataset.splitTextProcessed ||
        link.closest('.no-split-hover') ||
        link.classList.contains('no-split-hover') ||
        link.querySelector('.split-text-wrapper')
      ) {
        return;
      }

      // Check if link contains span children with text
      const targetSpans = link.querySelectorAll('span');
      let handled = false;

      if (targetSpans.length > 0) {
        targetSpans.forEach((span) => {
          // Only split pure text spans, not badges, icons or complex containers
          if (
            span.children.length === 0 &&
            span.textContent &&
            span.textContent.trim().length > 0 &&
            !span.classList.contains('badge') &&
            !span.dataset.splitTextProcessed
          ) {
            applySplitText(span);
            handled = true;
          }
        });
      }

      if (!handled) {
        // Split direct text node children
        Array.from(link.childNodes).forEach((node) => {
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent &&
            node.textContent.trim().length > 0
          ) {
            const wrapper = document.createElement('span');
            link.insertBefore(wrapper, node);
            wrapper.textContent = node.textContent;
            node.remove();
            applySplitText(wrapper);
            handled = true;
          }
        });
      }

      link.dataset.splitTextProcessed = 'true';
    };

    const processAll = () => {
      // Find all hyperlinks, nav buttons, and text action links
      const links = document.querySelectorAll(
        'a[href], nav button, header button, footer button, .split-hover-link'
      );
      links.forEach((el) => {
        processLink(el as HTMLElement);
      });
    };

    // Initial run
    processAll();

    // Observe future DOM updates
    const observer = new MutationObserver(() => {
      processAll();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
}
