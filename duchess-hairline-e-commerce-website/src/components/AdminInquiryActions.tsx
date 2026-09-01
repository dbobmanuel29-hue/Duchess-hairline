import { useEffect } from 'react';
import { auth } from '../services/firebase';
import { deleteInquiry, listInquiries, type Inquiry } from '../services/inquiryService';

function articleMatchesInquiry(article: HTMLElement, inquiry: Inquiry) {
  const text = (article.textContent || '').trim().toLowerCase();
  const candidates = [inquiry.email, inquiry.phone, inquiry.name, inquiry.message, inquiry.productName]
    .filter(Boolean)
    .map(value => String(value).trim().toLowerCase())
    .filter(value => value.length >= 3);
  return candidates.some(value => text.includes(value));
}

export default function AdminInquiryActions() {
  useEffect(() => {
    if (window.location.pathname !== '/admin') return;

    let disposed = false;
    let observer: MutationObserver | undefined;
    let inquiries: Inquiry[] = [];
    let loading = false;

    const load = async () => {
      if (loading) return;
      loading = true;
      try { inquiries = await listInquiries(); } catch { inquiries = []; }
      finally { loading = false; }
    };

    const scan = () => {
      if (disposed || !inquiries.length) return;
      const articles = Array.from(document.querySelectorAll('article')) as HTMLElement[];
      inquiries.forEach(inquiry => {
        const article = articles.find(item => articleMatchesInquiry(item, inquiry));
        if (!article || article.querySelector('[data-admin-delete-inquiry]')) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.adminDeleteInquiry = 'true';
        button.textContent = 'Delete request';
        button.className = 'mt-3 rounded-xl border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50';
        button.addEventListener('click', async () => {
          if (!auth?.currentUser) return alert('Your admin session has expired. Please sign in again.');
          const name = inquiry.name || inquiry.email || inquiry.phone || 'this client request';
          if (!window.confirm(`Delete ${name}'s client request? This permanently removes the inquiry and cannot be undone.`)) return;
          button.disabled = true;
          button.textContent = 'Deleting…';
          try {
            await deleteInquiry(inquiry.id);
            inquiries = inquiries.filter(item => item.id !== inquiry.id);
            article.remove();
          } catch (error) {
            alert(error instanceof Error ? error.message : 'Could not delete the client request.');
            button.disabled = false;
            button.textContent = 'Delete request';
          }
        });
        article.appendChild(button);
      });
    };

    void load().then(scan);
    scan();
    observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      disposed = true;
      observer?.disconnect();
    };
  }, []);

  return null;
}
