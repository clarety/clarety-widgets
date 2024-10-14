import React from 'react';

let _turnstileToken = null;
let _loadTurnstilePromise = null;

async function loadTurnstile() {
  if (!_loadTurnstilePromise) {
    _loadTurnstilePromise = new Promise((resolve, reject) => {
      if (window.turnstile) {
        // turnstile script already loaded.
        resolve(window.turnstile);
      } else {
        // inject the turnstile script.
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=claretyOnLoadTurnstile';
        script.async = true;

        // error handler.
        script.addEventListener('error', () => {
          reject('Error loading Turnstile script');
          delete window.claretyOnLoadTurnstile;
        });

        // load handler.
        window.claretyOnLoadTurnstile = () => {
          resolve(window.turnstile);
          delete window.claretyOnLoadTurnstile;
        };

        document.head.appendChild(script);
      }
    });
  }

  return _loadTurnstilePromise;
}

function useTurnstile() {
  const [turnstile, setTurnstile] = React.useState();

  React.useEffect(() => {
    loadTurnstile()
      .then(turnstile => setTurnstile(turnstile));
  }, []);

  return turnstile;
}

export function currentTurnstileToken() {
  return _turnstileToken;
}

export function Turnstile({ siteKey }) {
  const ref = React.useRef();
  const turnstile = useTurnstile();

  React.useEffect(() => {
    if (turnstile && ref.current) {
      turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token) => {
          _turnstileToken = token;
        },
      });
    }
  }, [ref, turnstile]);

  return (
    <div ref={ref} />
  );
}
