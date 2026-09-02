const replacements: Array<[RegExp, string]> = [
  [/Could not load Firebase Authentication users/gi, "Could not load registered users"],
  [/Firebase Authentication users/gi, "registered users"],
  [/Firebase Authentication/gi, "registered accounts"],
  [/saved to Firebase/gi, "saved securely"],
  [/loaded from Firebase/gi, "data loaded"],
  [/refresh from Firebase/gi, "refresh data"],
  [/refreshed from Firebase/gi, "data refreshed"],
  [/Firebase is not connected/gi, "Store connection unavailable"],
  [/Add the VITE_FIREBASE_\* environment variables in Vercel and redeploy\./gi, "The store connection is not configured. Please contact the site administrator."],
  [/Firebase/gi, "store services"],
];

function cleanText(value: string): string {
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function sanitizeNode(root: Node): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let current: Node | null = walker.nextNode();

  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    const cleaned = cleanText(node.nodeValue ?? "");
    if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
  });

  if (root instanceof Element) {
    ["title", "aria-label", "placeholder", "data-tooltip"].forEach((attribute) => {
      const value = root.getAttribute(attribute);
      if (!value) return;
      const cleaned = cleanText(value);
      if (cleaned !== value) root.setAttribute(attribute, cleaned);
    });
  }
}

export function installUiBrandingSanitizer(): () => void {
  if (typeof document === "undefined") return () => undefined;

  sanitizeNode(document.body);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
        const node = mutation.target as Text;
        const cleaned = cleanText(node.nodeValue ?? "");
        if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
        return;
      }

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node as Text;
          const cleaned = cleanText(text.nodeValue ?? "");
          if (cleaned !== text.nodeValue) text.nodeValue = cleaned;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          sanitizeNode(node);
        }
      });

      if (mutation.type === "attributes" && mutation.target instanceof Element) {
        sanitizeNode(mutation.target);
      }
    });
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["title", "aria-label", "placeholder", "data-tooltip"],
  });

  return () => observer.disconnect();
}
