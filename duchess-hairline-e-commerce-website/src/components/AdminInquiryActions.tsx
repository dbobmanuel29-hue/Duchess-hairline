import { useEffect } from 'react';
import { auth } from '../services/firebase';
import { deleteInquiry, listInquiries, type Inquiry } from '../services/inquiryService';

function uniqueMatches(article: HTMLElement, inquiry: Inquiry) {
  const text = (article.textContent || '').trim().toLowerCase();
  const unique = [inquiry.email, inquiry.phone].filter(Boolean).map(v => String(v).trim().toLowerCase()).filter(v => v.length >= 4);
  if (unique.length) return unique.some(v => text.includes(v));
  const name = String(inquiry.name || '').trim().toLowerCase();
  const message = String(inquiry.message || '').trim().toLowerCase();
  return !!name && name.length >= 4 && text.includes(name) && (!message || message.length < 4 || text.includes(message));
}

function findInquiryArticles(inquiries: Inquiry[]) {
  const articles = Array.from(document.querySelectorAll('article')) as HTMLElement[];
  const used = new Set<HTMLElement>();
  return inquiries.map(inquiry => {
    const article = articles.find(item => !used.has(item) && uniqueMatches(item, inquiry));
    if (article) used.add(article);
    return { inquiry, article };
  });
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
      for (const { inquiry, article } of findInquiryArticles(inquiries)) {
        if (!article || article.querySelector('[data-admin-delete-inquiry]')) continue;

        const actions = document.createElement('div');
        actions.dataset.adminInquiryActions = 'true';
        actions.className = 'mt-3 flex justify-end';

        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.adminDeleteInquiry = 'true';
        button.textContent = 'Delete request';
        button.className = 'rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50';

        button.addEventListener('click', async () => {
          if (!auth?.currentUser) {
            alert('Your admin session has expired. Please sign in again.');
            return;
          }
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

        actions.appendChild(button);
        article.appendChild(actions);
      }
    };

    void load().then(scan);
    scan();
    observer = new MutationObserver(() => scan());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      observer?.disconnect();
    };
  }, []);

  return null;
}
