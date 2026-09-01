import { useEffect } from 'react';
import { auth } from '../services/firebase';
import { deleteInquiry, listInquiries, type Inquiry } from '../services/inquiryService';

function findInquiryTable() {
  return Array.from(document.querySelectorAll('table')).find(table => {
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim().toLowerCase() || '');
    const hasStatus = headers.some(h => h === 'status');
    const hasCustomer = headers.some(h => ['customer', 'name', 'client'].includes(h));
    const hasRequest = headers.some(h => ['request', 'message', 'product'].includes(h));
    const hasSignIn = headers.some(h => h === 'sign-in method');
    return hasStatus && (hasCustomer || hasRequest) && !hasSignIn;
  }) as HTMLTableElement | undefined;
}

function rowMatchesInquiry(row: HTMLTableRowElement, inquiry: Inquiry) {
  const text = (row.textContent || '').trim().toLowerCase();
  const candidates = [inquiry.name, inquiry.email, inquiry.phone, inquiry.productName, inquiry.message]
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
      if (disposed) return;
      const table = findInquiryTable();
      if (!table) return;

      const header = table.querySelector('thead tr');
      if (header && !header.querySelector('[data-admin-inquiry-actions-header]')) {
        const th = document.createElement('th');
        th.textContent = 'Actions';
        th.dataset.adminInquiryActionsHeader = 'true';
        th.className = 'text-right';
        header.appendChild(th);
      }

      const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
      rows.forEach(row => {
        if (row.querySelector('[data-admin-delete-inquiry]')) return;
        const inquiry = inquiries.find(item => rowMatchesInquiry(row, item));
        if (!inquiry) return;

        const cell = document.createElement('td');
        cell.className = 'text-right';
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.adminDeleteInquiry = 'true';
        button.textContent = 'Delete';
        button.className = 'rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50';
        button.addEventListener('click', async () => {
          if (!auth?.currentUser) return alert('Your admin session has expired. Please sign in again.');
          const name = inquiry.name || inquiry.email || inquiry.phone || 'this client request';
          if (!window.confirm(`Delete ${name}'s client request? This permanently removes the inquiry and cannot be undone.`)) return;
          button.disabled = true;
          button.textContent = 'Deleting…';
          try {
            await deleteInquiry(inquiry.id);
            inquiries = inquiries.filter(item => item.id !== inquiry.id);
            row.remove();
          } catch (error) {
            alert(error instanceof Error ? error.message : 'Could not delete the client request.');
            button.disabled = false;
            button.textContent = 'Delete';
          }
        });
        cell.appendChild(button);
        row.appendChild(cell);
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
