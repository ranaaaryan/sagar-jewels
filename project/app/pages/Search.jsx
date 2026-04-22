// Search page — matches the app's warm jewellery aesthetic.
// Empty state: recent searches (chips w/ × remove), trending terms (ordinal list),
// quick category tiles, popular picks grid. Typing state: live grouped suggestions
// (products / categories / collections) with a "See all results for…" row and
// a results count pill. Bar has autofocus, clear (×), and a brown submit pill.

const SH = window.JEWEL_TOKENS;

const S_BG        = 'rgb(247,246,242)';
const S_CARD      = '#fff';
const S_CREAM     = 'rgb(239,232,227)';
const S_SOFT      = 'rgb(244,244,242)';
const S_INK       = 'rgb(48,51,51)';
const S_INK_SOFT  = 'rgb(93,96,95)';
const S_INK_MUTED = 'rgb(120,123,122)';
const S_ACCENT    = 'rgb(122,88,67)';
const S_ACCENT_LT = 'rgb(175,130,109)';
const S_LINE      = 'rgb(237,238,237)';
const S_GOLD      = 'rgb(176,133,53)';

const TRENDING = [
  'Bridal vine choker',
  'Opaline drops',
  'Solitaire ring',
  'Temple jewellery',
  'Signet pendant',
  'Diamond nose pin',
];

const QUICK_CATS = [
  { label: 'Rings',      img: 'assets/products/emerald-ring.jpg' },
  { label: 'Necklaces',  img: 'assets/product/comp-necklace.jpg' },
  { label: 'Earrings',   img: 'assets/product/comp-studs.jpg' },
  { label: 'Bracelets',  img: 'assets/product/comp-bracelet.jpg' },
  { label: 'Pendants',   img: 'assets/home/cat-pendants.jpg' },
  { label: 'Anklets',    img: 'assets/home/cat-anklets.jpg' },
];

const POPULAR = [
  { name: 'Lumière solitaire ring',  price: 48900, meta: '18K ROSE GOLD · 0.30CT', img: 'assets/products/emerald-ring.jpg', cat: 'ring' },
  { name: 'Opaline drop earrings',   price: 22400, meta: '14K YELLOW GOLD · OPAL', img: 'assets/product/comp-studs.jpg',    cat: 'earring' },
  { name: 'Monogram signet pendant', price: 18400, meta: '14K YELLOW GOLD',        img: 'assets/product/comp-necklace.jpg', cat: 'necklace' },
  { name: 'Pebble stacking cuff',    price: 62400, meta: '18K YELLOW GOLD',        img: 'assets/product/comp-bracelet.jpg', cat: 'bracelet' },
];

const COLLECTIONS = ['Bridal Vine', 'Temple Edit', 'Everyday Gold', 'Lumière', 'Monogram'];

function SearchPage({ go, state, setState }) {
  const [query, setQuery] = React.useState('');
  const [recent, setRecent] = React.useState(() => state.recentSearches || [
    'rose gold ring', 'emerald earrings', 'bridal set',
  ]);
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);
  React.useEffect(() => {
    setState(s => ({ ...s, recentSearches: recent }));
  }, [recent]);

  function submit(term) {
    const q = (term ?? query).trim();
    if (!q) return;
    setRecent(r => [q, ...r.filter(x => x.toLowerCase() !== q.toLowerCase())].slice(0, 8));
    setQuery(q);
    go('listing');
  }

  function removeRecent(term) {
    setRecent(r => r.filter(x => x !== term));
  }

  const q = query.trim().toLowerCase();
  const isTyping = q.length > 0;

  const prodMatches = POPULAR.filter(p =>
    p.name.toLowerCase().includes(q) || p.meta.toLowerCase().includes(q) || p.cat.includes(q)
  );
  const catMatches = QUICK_CATS.filter(c => c.label.toLowerCase().includes(q));
  const collMatches = COLLECTIONS.filter(c => c.toLowerCase().includes(q));
  const totalMatches = prodMatches.length + catMatches.length + collMatches.length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: S_BG, minHeight: 0 }}>
      {/* ── Top bar: back + input pill + submit ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 15px 12px',
      }}>
        <button onClick={() => go('home')} aria-label="Back" style={{
          width: 45, height: 44, borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: '0 1px 2px rgba(58,42,28,0.05)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{
          flex: 1, height: 53, borderRadius: 50, background: '#fff',
          display: 'flex', alignItems: 'center', padding: '0 4px 0 20px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(31,31,31)"
               strokeWidth="1.6" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            placeholder="Search rings, necklaces, collections…"
            style={{
              flex: 1, paddingLeft: 12, fontFamily: 'Manrope', fontSize: 15,
              color: S_INK, letterSpacing: 0.3,
              border: 'none', outline: 'none', background: 'transparent', minWidth: 0,
            }}
          />
          {query ? (
            <button onClick={() => setQuery('')} aria-label="Clear" style={{
              width: 28, height: 28, borderRadius: '50%', background: S_SOFT,
              border: 'none', cursor: 'pointer', marginRight: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: S_INK_SOFT,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
            </button>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={S_INK_MUTED}
                 strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10 }}>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>
            </svg>
          )}
          <button onClick={() => submit()} disabled={!query.trim()} style={{
            width: 45, height: 45, borderRadius: '50%',
            background: query.trim() ? S_ACCENT : 'rgba(115,92,0,0.12)',
            border: 'none',
            cursor: query.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke={query.trim() ? '#fff' : 'rgba(115,92,0,0.45)'}
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0 24px' }}>
        {isTyping ? (
          <TypingResults
            q={q}
            prodMatches={prodMatches}
            catMatches={catMatches}
            collMatches={collMatches}
            totalMatches={totalMatches}
            query={query}
            onSubmit={submit}
            go={go}
          />
        ) : (
          <EmptyState
            recent={recent}
            onRecent={submit}
            onRemoveRecent={removeRecent}
            onClearRecent={() => setRecent([])}
            go={go}
            onSubmit={submit}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ recent, onRecent, onRemoveRecent, onClearRecent, go, onSubmit }) {
  return (
    <>
      {/* Recent Searches */}
      {recent.length > 0 && (
        <div style={{ padding: '14px 15px 0' }}>
          <SectionHead title="Recent Searches" action={
            <button onClick={onClearRecent} style={linkBtn}>CLEAR</button>
          }/>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '2px 0 16px' }}>
            {recent.map(term => (
              <div key={term} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 6px 8px 14px',
                background: '#fff', borderRadius: 999, border: `1px solid ${S_LINE}`,
                fontFamily: 'Manrope', fontSize: 12.5, color: S_INK,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={S_INK_MUTED}
                     strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                     style={{ marginRight: 2 }}>
                  <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
                </svg>
                <button onClick={() => onRecent(term)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0,
                }}>{term}</button>
                <button onClick={() => onRemoveRecent(term)} aria-label={`Remove ${term}`} style={{
                  width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: S_INK_MUTED,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      <div style={{ padding: '4px 15px 0' }}>
        <SectionHead title="Trending Searches"
          action={<span style={{
            fontFamily: 'Manrope', fontSize: 10, color: S_GOLD, fontWeight: 700, letterSpacing: 1,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h7l-1 8 10-12h-7z"/>
            </svg>
            THIS WEEK
          </span>}/>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '6px 4px', marginTop: 4,
          border: `1px solid ${S_LINE}`,
        }}>
          {TRENDING.map((term, i) => (
            <button key={term} onClick={() => onSubmit(term)} style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left', padding: '11px 14px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: i < TRENDING.length - 1 ? `1px solid ${S_LINE}` : 'none',
            }}>
              <span style={{
                fontFamily: `'Noto Serif', serif`, fontSize: 14, fontWeight: 700,
                color: i < 3 ? S_ACCENT : S_INK_MUTED, width: 18, textAlign: 'center',
              }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{
                flex: 1, fontFamily: 'Manrope', fontSize: 14, color: S_INK,
              }}>{term}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S_INK_MUTED}
                   strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l10-10M7 7h10v10"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Categories */}
      <div style={{ padding: '22px 15px 0' }}>
        <SectionHead title="Browse by Category"/>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          marginTop: 2,
        }}>
          {QUICK_CATS.map(c => (
            <button key={c.label} onClick={() => { go('listing'); }} style={{
              background: '#fff', borderRadius: 14, border: 'none',
              padding: '12px 10px 14px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              boxShadow: '0 1px 3px rgba(48,51,51,0.04)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `url(${c.img}) center / cover no-repeat, ${S_CREAM}`,
              }}/>
              <span style={{
                fontFamily: `'Noto Serif', serif`, fontSize: 12.5, color: S_INK,
              }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular picks */}
      <div style={{ padding: '24px 15px 0' }}>
        <SectionHead title="Popular Picks"/>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 2,
        }}>
          {POPULAR.map(p => (
            <button key={p.name} onClick={() => go('product')} style={{
              background: '#fff', borderRadius: 14, border: 'none', padding: 10,
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 1px 3px rgba(48,51,51,0.04)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                aspectRatio: '1 / 1', borderRadius: 10, marginBottom: 8,
                background: `url(${p.img}) center / cover no-repeat, ${S_CREAM}`,
              }}/>
              <div style={{
                fontFamily: `'Noto Serif', serif`, fontWeight: 700, fontSize: 14,
                color: S_INK, lineHeight: 1.25,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>{p.name}</div>
              <div style={{
                marginTop: 4, fontFamily: 'Manrope', fontSize: 10, letterSpacing: 0.8,
                color: S_INK_MUTED, textTransform: 'uppercase',
              }}>{p.meta}</div>
              <div style={{
                marginTop: 6, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: S_ACCENT,
              }}>₹{p.price.toLocaleString('en-IN')}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function TypingResults({ q, prodMatches, catMatches, collMatches, totalMatches, query, onSubmit, go }) {
  return (
    <div style={{ padding: '8px 15px 0' }}>
      {/* See-all row */}
      <button onClick={() => onSubmit()} style={{
        width: '100%', padding: '14px 18px', borderRadius: 14,
        background: S_CREAM, border: 'none', cursor: 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S_ACCENT}
             strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: S_INK,
          }}>See all results for "<span style={{ color: S_ACCENT }}>{query}</span>"</div>
          <div style={{
            fontFamily: 'Manrope', fontSize: 11, color: S_INK_SOFT, marginTop: 2,
          }}>{totalMatches} match{totalMatches === 1 ? '' : 'es'}{totalMatches === 0 ? ' — browse the full catalogue' : ''}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 13 13" fill={S_ACCENT}>
          <path d="M10.1 6.9L0 6.9V5.6h10.1L5.4.9 6.3 0l6.2 6.2-6.2 6.3-.9-.9z"/>
        </svg>
      </button>

      {/* Products */}
      {prodMatches.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <GroupLabel>Products</GroupLabel>
          <div style={{
            background: '#fff', borderRadius: 16, border: `1px solid ${S_LINE}`,
            overflow: 'hidden',
          }}>
            {prodMatches.map((p, i) => (
              <button key={p.name} onClick={() => go('product')} style={{
                width: '100%', padding: '12px 14px', background: 'none', border: 'none',
                borderBottom: i < prodMatches.length - 1 ? `1px solid ${S_LINE}` : 'none',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                  background: `url(${p.img}) center / cover no-repeat, ${S_CREAM}`,
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: `'Noto Serif', serif`, fontWeight: 700, fontSize: 14,
                    color: S_INK, lineHeight: 1.25,
                  }}>{highlight(p.name, q)}</div>
                  <div style={{
                    fontFamily: 'Manrope', fontSize: 10, letterSpacing: 0.8,
                    color: S_INK_MUTED, textTransform: 'uppercase', marginTop: 2,
                  }}>{p.meta}</div>
                </div>
                <div style={{
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: S_ACCENT,
                  whiteSpace: 'nowrap',
                }}>₹{p.price.toLocaleString('en-IN')}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {catMatches.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <GroupLabel>Categories</GroupLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {catMatches.map(c => (
              <button key={c.label} onClick={() => go('listing')} style={{
                padding: '10px 16px', borderRadius: 999, background: '#fff',
                border: `1px solid ${S_LINE}`, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'Manrope', fontSize: 13, color: S_INK,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: `url(${c.img}) center / cover no-repeat, ${S_CREAM}`,
                }}/>
                {highlight(c.label, q)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collections */}
      {collMatches.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <GroupLabel>Collections</GroupLabel>
          <div style={{
            background: '#fff', borderRadius: 16, border: `1px solid ${S_LINE}`, overflow: 'hidden',
          }}>
            {collMatches.map((c, i) => (
              <button key={c} onClick={() => go('listing')} style={{
                width: '100%', padding: '12px 16px', background: 'none', border: 'none',
                borderBottom: i < collMatches.length - 1 ? `1px solid ${S_LINE}` : 'none',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                fontFamily: `'Noto Serif', serif`, fontSize: 14, color: S_INK,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: S_CREAM, color: S_ACCENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7h16l-2 13H6L4 7zM9 7a3 3 0 016 0"/>
                  </svg>
                </div>
                <span style={{ flex: 1 }}>{highlight(c, q)} <span style={{ color: S_INK_MUTED, fontSize: 12 }}>collection</span></span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S_INK_MUTED}
                     strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zero state */}
      {totalMatches === 0 && (
        <div style={{
          marginTop: 24, padding: 24, background: '#fff', borderRadius: 16,
          border: `1px solid ${S_LINE}`, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: `'Noto Serif', serif`, fontSize: 16, color: S_INK, marginBottom: 4,
          }}>No quick matches for "{query}"</div>
          <div style={{
            fontFamily: 'Manrope', fontSize: 12.5, color: S_INK_SOFT, lineHeight: 1.5,
          }}>Tap the arrow or press enter to search our full catalogue — we'll hand it to a stylist if nothing fits.</div>
        </div>
      )}
    </div>
  );
}

function highlight(text, q) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ background: 'rgba(175,130,109,0.18)', color: S_ACCENT, borderRadius: 3, padding: '0 2px' }}>
        {text.slice(i, i + q.length)}
      </span>
      {text.slice(i + q.length)}
    </>
  );
}

function GroupLabel({ children }) {
  return (
    <div style={{
      padding: '0 4px 10px',
      fontFamily: 'Manrope', fontWeight: 700, fontSize: 10, letterSpacing: 1.4,
      color: S_INK_MUTED, textTransform: 'uppercase',
    }}>{children}</div>
  );
}

function SectionHead({ title, action }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '0 4px 10px',
    }}>
      <h3 style={{
        margin: 0, fontFamily: `'Noto Serif', serif`, fontWeight: 500, fontSize: 18,
        color: S_INK, letterSpacing: 0.5,
      }}>{title}</h3>
      {action}
    </div>
  );
}

const linkBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: S_ACCENT, fontFamily: 'Manrope', fontWeight: 700,
  fontSize: 11, letterSpacing: 1.2,
};

window.SearchPage = SearchPage;
