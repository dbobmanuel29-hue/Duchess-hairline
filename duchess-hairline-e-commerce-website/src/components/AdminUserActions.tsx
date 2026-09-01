import { useEffect } from 'react';
import { auth } from '../services/firebase';

function getTable() {
  return Array.from(document.querySelectorAll('table')).find(table =>
    Array.from(table.querySelectorAll('th')).some(th => th.textContent?.trim() === 'Sign-in method')
  ) as HTMLTableElement | undefined;
}

export default function AdminUserActions() {
  useEffect(() => {
    if (window.location.pathname !== '/admin') return;

    let observer: MutationObserver | undefined;
    let disposed = false;

    const scan = () => {
      if (disposed) return;
      const table = getTable();
      if (!table) return;
      const header = table.querySelector('thead tr');
      if (header && !header.querySelector('[data-admin-user-actions-header]')) {
        const th = document.createElement('th');
        th.textContent = 'Actions';
        th.dataset.adminUserActionsHeader = 'true';
        th.className = 'text-right';
        header.appendChild(th);
      }

      const rows = Array.from(table.querySelectorAll('tbody tr'));
      rows.forEach(row => {
        if (row.querySelector('[data-admin-delete-user]')) return;
        const cells = Array.from(row.querySelectorAll('td'));
        const email = cells[1]?.textContent?.trim() || '';
        const phone = cells[2]?.textContent?.trim() || '';
        const identifier = email && email !== '—' ? email : phone !== '—' ? phone : '';
        if (!identifier) return;

        const cell = document.createElement('td');
        cell.className = 'text-right';
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.adminDeleteUser = 'true';
        button.textContent = 'Delete';
        button.className = 'rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50';
        button.addEventListener('click', async () => {
          if (!auth?.currentUser) return alert('Your admin session has expired. Please sign in again.');
          const name = cells[0]?.textContent?.trim() || identifier;
          if (!window.confirm(`Delete ${name}? This permanently removes the Firebase Authentication account and Firestore profile. This cannot be undone.`)) return;
          button.disabled = true;
          button.textContent = 'Deleting…';
          try {
            const token = await auth.currentUser.getIdToken(true);
            const payload = identifier.includes('@') ? { email: identifier } : { phone: identifier };
            const response = await fetch('/api/admin/delete-user', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'User deletion failed.');
            alert('User deleted successfully.');
            window.location.reload();
          } catch (error) {
            alert(error instanceof Error ? error.message : 'User deletion failed.');
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
