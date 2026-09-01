import { useEffect } from 'react';
import { deleteInquiry } from '../services/inquiryService';

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

export default function AdminInquiryActions() {
  useEffect(() => {
    if (window.location.pathname !== '/admin') return;

    let disposed = false;
    let observer: MutationObserver | undefined;

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

      const rows = Array.from(table.querySelectorAll('tbody tr'));
      rows.forEach(row => {
        if (row.querySelector('[data-admin-delete-inquiry]')) return;

        const cells = Array.from(row.querySelectorAll('td'));
        if (!cells.length) return;
        const displayName = cells[0]?.textContent?.trim() || 'this client request';
        const id = row.getAttribute('data-inquiry-id') || '';

        // Prefer an ID embedded by the inquiry row. If the existing table does
        // not expose it, fall back to the row's React key is not possible from
        // the DOM, so leave the row untouched rather than deleting the wrong item.
        if (!id) return;

        const cell = document.createElement('td');
        cell.className = 'text-right';
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.adminDeleteInquiry = 'true';
        button.textContent = 'Delete';
        button.className = 'rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50';
        button.addEventListener('click', async () => {
          if (!window.confirm(`Delete ${displayName}'s client request? This permanently removes the inquiry and cannot be undone.`)) return;
          button.disabled = true;
          button.textContent = 'Deleting…';
          try {
            await deleteInquiry(id);
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
