/*
 * SAKURA ASIAN FUSION — Website Rebuild
 * 
 * DEPLOYMENT NOTES FOR CLAUDE CODE:
 * 1. Extract all images from the GALLERY array below (src URLs from sakuraasianfusion.com)
 * 2. Download and save them locally to /public/gallery/ 
 * 3. Update src paths to local references
 * 4. Images are labeled with dish name + category for alt text / captions
 * 5. Deploy to Vercel as Next.js or Vite React app
 * 6. Fonts used: EB Garamond, Space Mono, Sora (Google Fonts)
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const CATS = ["All","Soups","Appetizers","Sushi Bar","Special Rolls","Makimono","Nigiri","Hibachi","Pho & Noodles","Wok & Fusion","Tempura","Rice","Lo Mein","Classics","Vegetarian","Dessert"];

const MENU = [
  {id:1,n:"Egg Drop Soup",p:4.5,c:"Soups",d:"Chicken broth, silky egg ribbons, scallion",pop:1},
  {id:2,n:"Tom Yum Gai",p:7,c:"Soups",d:"Lemongrass, galangal, lime leaf, chicken, mushroom, chili",s:1},
  {id:3,n:"Miso Soup",p:4.5,c:"Soups",d:"White miso, silken tofu, wakame, scallion",pop:1},
  {id:4,n:"Mushroom Soup",p:5,c:"Soups",d:"Shiitake, button mushroom, slow-simmered"},
  {id:5,n:"House Salad",p:5,c:"Soups",d:"Mixed greens, carrot, ginger-sesame dressing"},
  {id:6,n:"Seaweed Salad",p:6.5,c:"Soups",d:"Wakame, sesame oil, rice vinegar, togarashi"},
  {id:10,n:"Gỏi Cuốn",p:6.5,c:"Appetizers",d:"Two fresh rolls — shrimp, herbs, vermicelli, peanut dip",pop:1},
  {id:11,n:"Haru Maki",p:5,c:"Appetizers",d:"Two crispy vegetable spring rolls"},
  {id:12,n:"Edamame",p:5.5,c:"Appetizers",d:"Steamed, Maldon sea salt"},
  {id:13,n:"Gyoza",p:8,c:"Appetizers",d:"Six pan-fried pork dumplings, ponzu"},
  {id:14,n:"Crab Rangoon",p:7.5,c:"Appetizers",d:"Six pieces — cream cheese, crab, crispy wonton"},
  {id:15,n:"Calamari Tempura",p:9,c:"Appetizers",d:"Light batter, spicy mayo, lemon"},
  {id:16,n:"Tuna Tataki",p:12,c:"Appetizers",d:"Seared ahi, ponzu, microgreens"},
  {id:20,n:"Chef's Special Boat",p:76,c:"Sushi Bar",d:"The full experience — premium sashimi and nigiri for two, served on traditional wooden boat",pop:1},
  {id:21,n:"Sushi Deluxe",p:28,c:"Sushi Bar",d:"Fifteen pieces, chef's selection nigiri"},
  {id:22,n:"Sashimi Deluxe",p:32,c:"Sushi Bar",d:"Eighteen slices, chef's selection"},
  {id:23,n:"Chirashi",p:22,c:"Sushi Bar",d:"Assorted sashimi over seasoned rice"},
  {id:30,n:"Sakura Roll",p:20,c:"Special Rolls",d:"Ten pieces — shrimp tempura, spicy tuna, avocado, house sakura sauce",pop:1},
  {id:31,n:"Dragon Roll",p:16,c:"Special Rolls",d:"Shrimp tempura, eel, avocado, eel sauce"},
  {id:32,n:"Rainbow Roll",p:17,c:"Special Rolls",d:"California base, five-fish sashimi topping"},
  {id:33,n:"Volcano Roll",p:15,c:"Special Rolls",d:"Spicy crab, shrimp tempura, baked spicy mayo",s:1},
  {id:34,n:"Tiger Roll",p:16,c:"Special Rolls",d:"Shrimp tempura, cucumber, avocado, tiger sauce"},
  {id:35,n:"Spider Roll",p:14,c:"Special Rolls",d:"Soft shell crab, cucumber, avocado"},
  {id:40,n:"California Roll",p:8,c:"Makimono",d:"Crab, avocado, cucumber — eight pieces"},
  {id:41,n:"Spicy Tuna Roll",p:10,c:"Makimono",d:"Tuna, chili oil, cucumber, sesame",s:1},
  {id:42,n:"Salmon Avocado",p:10,c:"Makimono",d:"Fresh salmon, avocado — eight pieces"},
  {id:43,n:"Philly Roll",p:9,c:"Makimono",d:"Smoked salmon, cream cheese, cucumber"},
  {id:44,n:"Spicy Hotate",p:12,c:"Makimono",d:"Scallop, chili, cucumber",s:1},
  {id:45,n:"Eel Avocado",p:11,c:"Makimono",d:"Unagi, avocado, eel sauce"},
  {id:50,n:"Salmon Nigiri",p:4,c:"Nigiri",d:"Two pieces — Atlantic salmon"},
  {id:51,n:"Tuna Nigiri",p:4.5,c:"Nigiri",d:"Two pieces — bluefin"},
  {id:52,n:"Yellowtail",p:4.5,c:"Nigiri",d:"Two pieces — hamachi",pop:1},
  {id:53,n:"Shrimp Nigiri",p:3.5,c:"Nigiri",d:"Two pieces — cooked ebi"},
  {id:54,n:"Eel Nigiri",p:5,c:"Nigiri",d:"Two pieces — unagi, eel sauce"},
  {id:60,n:"Steak & Shrimp",p:40,c:"Hibachi",d:"Premium steak, jumbo shrimp, seasonal vegetables, garlic fried rice",pop:1},
  {id:61,n:"Chicken Teriyaki",p:18,c:"Hibachi",d:"Grilled breast, teriyaki glaze, vegetables, fried rice"},
  {id:62,n:"Salmon Teriyaki",p:22,c:"Hibachi",d:"Grilled fillet, teriyaki, vegetables, fried rice"},
  {id:63,n:"Shrimp Teriyaki",p:20,c:"Hibachi",d:"Jumbo shrimp, teriyaki, vegetables, fried rice"},
  {id:64,n:"Vegetable Hibachi",p:14,c:"Hibachi",d:"Seasonal vegetables, garlic fried rice"},
  {id:70,n:"Phở Gà",p:14,c:"Pho & Noodles",d:"Chicken — slow-simmered broth, rice noodles, Thai basil, lime, sprouts",pop:1},
  {id:71,n:"Phở Bò",p:15,c:"Pho & Noodles",d:"Rare beef and brisket — aromatic star anise broth"},
  {id:72,n:"Tom Yum Noodle",p:17,c:"Pho & Noodles",d:"Spicy lemongrass broth, chicken, rice noodles",s:1},
  {id:73,n:"Wonton Noodle Soup",p:14,c:"Pho & Noodles",d:"Pork wontons, egg noodles, clear broth"},
  {id:80,n:"Pad Thai",p:16,c:"Wok & Fusion",d:"Tamarind, rice noodle, peanut, bean sprout, lime",pop:1},
  {id:81,n:"Cơm Thịt Nướng",p:15,c:"Wok & Fusion",d:"Grilled pork over rice, fried egg, pickled daikon"},
  {id:82,n:"Singapore Mei Fun",p:17.5,c:"Wok & Fusion",d:"Curry noodles, shrimp, pork, vegetables",s:1},
  {id:83,n:"Sesame Tuna",p:21,c:"Wok & Fusion",d:"Seared ahi, black and white sesame, wasabi aioli"},
  {id:84,n:"Thai Basil Stir Fry",p:16,c:"Wok & Fusion",d:"Holy basil, bell pepper, chili garlic, choice of protein",s:1},
  {id:90,n:"Chicken Tempura",p:14,c:"Tempura",d:"Light batter, tempura dipping sauce"},
  {id:91,n:"Shrimp Tempura",p:16,c:"Tempura",d:"Six jumbo shrimp, golden batter"},
  {id:92,n:"Chicken Katsu",p:15,c:"Tempura",d:"Panko crust, tonkatsu sauce, cabbage"},
  {id:93,n:"Vegetable Tempura",p:12,c:"Tempura",d:"Seasonal assortment, light batter"},
  {id:100,n:"Sakura Fried Rice",p:18,c:"Rice",d:"Shrimp, chicken, pork, egg, vegetables — house signature",pop:1},
  {id:101,n:"Chicken Fried Rice",p:14,c:"Rice",d:"Wok-fired, egg, scallion, vegetables"},
  {id:102,n:"Shrimp Fried Rice",p:16,c:"Rice",d:"Wok-fired, egg, scallion, vegetables"},
  {id:103,n:"Vegetable Fried Rice",p:12,c:"Rice",d:"Seasonal vegetables, egg, scallion"},
  {id:110,n:"Chicken Lo Mein",p:14,c:"Lo Mein",d:"Egg noodles, chicken, wok-tossed vegetables"},
  {id:111,n:"Shrimp Lo Mein",p:16,c:"Lo Mein",d:"Egg noodles, shrimp, vegetables"},
  {id:112,n:"Vegetable Lo Mein",p:12,c:"Lo Mein",d:"Egg noodles, mixed vegetables"},
  {id:120,n:"Chicken Curry",p:14.5,c:"Classics",d:"Japanese-style, potato, carrot, over rice",pop:1},
  {id:121,n:"BBQ Pork",p:18,c:"Classics",d:"Char siu, seasonal stir-fried vegetables"},
  {id:122,n:"General Tso's",p:15,c:"Classics",d:"Crispy chicken, sweet chili glaze",s:1},
  {id:123,n:"Kung Pao Chicken",p:15,c:"Classics",d:"Peanuts, dried chili, Sichuan pepper",s:1},
  {id:130,n:"Tofu Stir Fry",p:13,c:"Vegetarian",d:"Crispy tofu, garlic sauce, seasonal vegetables"},
  {id:131,n:"Vegetable Udon",p:13,c:"Vegetarian",d:"Thick wheat noodles, dashi broth, vegetables"},
  {id:140,n:"Mochi Ice Cream",p:6,c:"Dessert",d:"Three pieces — matcha, mango, strawberry"},
  {id:141,n:"Tempura Banana",p:5,c:"Dessert",d:"Crispy battered, honey, sesame"},
  {id:142,n:"Japanese Cheesecake",p:7,c:"Dessert",d:"Jiggly soufflé-style, powdered sugar"},
];

/*
 * GALLERY IMAGES — Extract from sakuraasianfusion.com
 * Claude Code: download each src to /public/gallery/{filename}, then update src to /gallery/{filename}
 * Layout: "wide" = spans 8 of 12 columns (16:9), default = spans 4 columns (1:1)
 */
const GALLERY = [
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634c64fe86ede.png", file:"chefs-special-boat.png", label:"Chef's Special Boat", cat:"Sushi Bar", span:"wide" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634e2f1624ad7.png", file:"sakura-special-roll.png", label:"Sakura Special Roll", cat:"Special Rolls" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634a36ab91b38.png", file:"sesame-crusted-tuna.png", label:"Sesame Crusted Tuna", cat:"Asian Fusion" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634a3578be4f2.png", file:"pad-thai.png", label:"Pad Thai", cat:"Asian Fusion", span:"wide" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634c60ce97180.png", file:"chirashi-bowl.png", label:"Chirashi Bowl", cat:"Sushi Bar" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634a32843be3e.png", file:"bo-luc-lac.png", label:"Bò Lúc Lắc", cat:"Asian Fusion" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-63a91b10102c5.jpg", file:"bibimbap.jpg", label:"Bibimbap", cat:"Asian Fusion" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634f6df6a2737.png", file:"fuji-mountain-roll.png", label:"Fuji Mountain Roll", cat:"Special Rolls", span:"wide" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634c5ed53bbfb.png", file:"sushi-combo-a.png", label:"Sushi Combo A", cat:"Sushi Bar" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634a330359c53.png", file:"com-thit-nuong.png", label:"Cơm Thịt Nướng", cat:"Asian Fusion" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-63afca94a1f8c.jpg", file:"hurricane-roll.jpg", label:"Hurricane Roll", cat:"Special Rolls" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634a366888070.png", file:"korean-bulgogi.png", label:"Korean Bulgogi", cat:"Asian Fusion", span:"wide" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634f6e55382ad.png", file:"dancing-shrimp.png", label:"Dancing Shrimp Roll", cat:"Special Rolls" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634e2dfb18955.png", file:"orange-lake-roll.png", label:"Orange Lake Roll", cat:"Special Rolls" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634a352ab36f5.png", file:"firecracker-shrimp.png", label:"Firecracker Shrimp", cat:"Asian Fusion", span:"wide" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-63b522948c30d.jpg", file:"unadon.jpg", label:"Unadon", cat:"Sushi Bar" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634e2c9d8eef3.png", file:"golden-roll.png", label:"Golden Roll", cat:"Special Rolls" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634a393aad7de.png", file:"omelet-rice.png", label:"Omelet Rice", cat:"Asian Fusion" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634c5f6278607.png", file:"sushi-combo-b.png", label:"Sushi Combo B", cat:"Sushi Bar", span:"wide" },
  { src:"https://sakuraasianfusion.com/storage/app/public/admin-assets/images/item/item-634e2bb13daf2.png", file:"tempura-salmon-roll.png", label:"Tempura Salmon Roll", cat:"Special Rolls" },
];

function Sakura() {
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sy, setSy] = useState(0);
  const [q, setQ] = useState("");
  const [placed, setPlaced] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const menuRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => { setTimeout(() => setHeroLoaded(true), 100); }, []);
  useEffect(() => {
    const h = () => setSy(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
  }, [lightbox]);
  useEffect(() => {
    if (lightbox === null) return;
    const h = (e) => { if (e.key === "Escape") setLightbox(null); if (e.key === "ArrowRight") setLightbox(p => (p + 1) % GALLERY.length); if (e.key === "ArrowLeft") setLightbox(p => (p - 1 + GALLERY.length) % GALLERY.length); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox]);

  const add = useCallback((item) => setCart(p => {
    const e = p.find(c => c.id === item.id);
    return e ? p.map(c => c.id === item.id ? {...c, qty: c.qty+1} : c) : [...p, {...item, qty:1}];
  }), []);
  const upd = useCallback((id, d) => setCart(p => p.map(c => c.id===id ? {...c,qty:Math.max(0,c.qty+d)} : c).filter(c=>c.qty>0)), []);

  const tot = cart.reduce((s,c) => s + c.p * c.qty, 0);
  const cnt = cart.reduce((s,c) => s + c.qty, 0);

  const filtered = useMemo(() => {
    let items = MENU;
    if (cat !== "All") items = items.filter(i => i.c === cat);
    if (q.trim()) { const s = q.toLowerCase(); items = items.filter(i => i.n.toLowerCase().includes(s) || i.d.toLowerCase().includes(s)); }
    return items;
  }, [cat, q]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(i => { if (!g[i.c]) g[i.c] = []; g[i.c].push(i); });
    return Object.entries(g);
  }, [filtered]);

  const goMenu = () => menuRef.current?.scrollIntoView({ behavior: "smooth" });
  const goGallery = () => galleryRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#060606", color: "#D6D1CA", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Space+Mono:wght@400;700&family=Sora:wght@200;300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}

        body::before{
          content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;
          background:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:0.025;mix-blend-mode:overlay;
        }
        ::selection{background:rgba(200,120,140,0.3);color:#fff}

        .nav-a{font-family:'Sora',sans-serif;font-size:11px;font-weight:300;letter-spacing:0.08em;color:#7A756F;text-decoration:none;transition:color 0.3s;cursor:pointer}
        .nav-a:hover{color:#D6D1CA}

        .f-cat{font-family:'Sora',sans-serif;font-size:11px;font-weight:300;letter-spacing:0.06em;color:#5A5650;background:none;border:none;cursor:pointer;padding:0.6rem 0;transition:color 0.3s;border-bottom:1px solid transparent;white-space:nowrap}
        .f-cat:hover{color:#D6D1CA}
        .f-cat.on{color:#C8788C;border-bottom-color:#C8788C}

        .m-row{display:grid;grid-template-columns:1fr 80px 90px;gap:0;align-items:center;padding:14px 0;border-bottom:1px solid rgba(214,209,202,0.04);transition:all 0.25s cubic-bezier(0.2,0,0,1)}
        .m-row:hover{background:rgba(214,209,202,0.02);padding-left:12px;padding-right:12px;margin:0 -12px;border-radius:2px}
        .m-name{font-family:'EB Garamond',serif;font-size:16.5px;font-weight:400;color:#D6D1CA;letter-spacing:0.01em;line-height:1.2}
        .m-desc{font-family:'Sora',sans-serif;font-size:11.5px;font-weight:200;color:#5A5650;line-height:1.5;margin-top:3px;letter-spacing:0.01em}
        .m-price{font-family:'Space Mono',monospace;font-size:13px;font-weight:400;color:#7A756F;text-align:right;letter-spacing:-0.02em}

        .a-btn{font-family:'Sora',sans-serif;font-size:10px;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:#7A756F;background:none;border:1px solid rgba(214,209,202,0.08);padding:7px 14px;cursor:pointer;transition:all 0.25s}
        .a-btn:hover{color:#C8788C;border-color:rgba(200,120,140,0.3);background:rgba(200,120,140,0.04)}

        .q-b{width:24px;height:24px;border:1px solid rgba(214,209,202,0.08);background:none;color:#7A756F;font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s}
        .q-b:hover{border-color:rgba(200,120,140,0.3);color:#C8788C}

        .tag{display:inline-block;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.06em;padding:2px 6px;margin-left:8px;position:relative;top:-1px}

        .srch{width:100%;padding:10px 12px 10px 32px;background:rgba(214,209,202,0.03);border:1px solid rgba(214,209,202,0.06);font-family:'Sora',sans-serif;font-size:13px;font-weight:300;color:#D6D1CA;outline:none;transition:border-color 0.3s;letter-spacing:0.01em}
        .srch:focus{border-color:rgba(200,120,140,0.25)}
        .srch::placeholder{color:#3D3A36}

        .cat-track{display:flex;gap:0;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid rgba(214,209,202,0.04)}
        .cat-track::-webkit-scrollbar{display:none}

        .sec-label{font-family:'Sora',sans-serif;font-size:10px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:#C8788C;padding:28px 0 12px}

        .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:80;backdrop-filter:blur(12px)}
        .drawer{position:fixed;top:0;right:0;bottom:0;width:min(400px,100vw);background:#0A0A08;z-index:90;border-left:1px solid rgba(214,209,202,0.04);display:flex;flex-direction:column;animation:dIn 0.35s cubic-bezier(0.2,0,0,1)}
        @keyframes dIn{from{transform:translateX(100%)}to{transform:translateX(0)}}

        .order-float{position:fixed;bottom:28px;right:28px;z-index:60;background:rgba(200,120,140,0.12);border:1px solid rgba(200,120,140,0.2);backdrop-filter:blur(16px);color:#C8788C;padding:12px 22px;cursor:pointer;display:flex;align-items:center;gap:12px;font-family:'Sora',sans-serif;font-weight:400;font-size:12px;letter-spacing:0.04em;transition:all 0.3s;border-radius:0}
        .order-float:hover{background:rgba(200,120,140,0.18);border-color:rgba(200,120,140,0.35);transform:translateY(-2px)}

        .jp{font-family:'EB Garamond',serif;writing-mode:vertical-rl;color:rgba(214,209,202,0.03);font-size:120px;font-weight:400;position:absolute;user-select:none;pointer-events:none}

        @keyframes breathe{0%,100%{opacity:0.03}50%{opacity:0.06}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}

        /* Gallery */
        .g-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:3px}
        .g-cell{position:relative;overflow:hidden;cursor:pointer;background:#0A0A08}
        .g-cell img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.7) contrast(1.05) saturate(0.9);transition:all 0.6s cubic-bezier(0.2,0,0,1)}
        .g-cell:hover img{filter:brightness(0.85) contrast(1) saturate(1);transform:scale(1.04)}
        .g-info{position:absolute;bottom:0;left:0;right:0;padding:24px 16px 14px;background:linear-gradient(0deg, rgba(6,6,6,0.85) 0%, transparent 100%);opacity:0;transform:translateY(8px);transition:all 0.4s cubic-bezier(0.2,0,0,1)}
        .g-cell:hover .g-info{opacity:1;transform:translateY(0)}

        /* Lightbox */
        .lb{position:fixed;inset:0;z-index:200;background:rgba(6,6,6,0.94);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;cursor:pointer}
        .lb-img{max-width:min(85vw,900px);max-height:80vh;object-fit:contain;border:1px solid rgba(214,209,202,0.04);cursor:default}
        .lb-nav{position:absolute;top:50%;transform:translateY(-50%);background:none;border:1px solid rgba(214,209,202,0.1);color:#7A756F;width:44px;height:44px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:16px;transition:all 0.2s}
        .lb-nav:hover{border-color:rgba(200,120,140,0.3);color:#C8788C}

        @media(max-width:720px){
          .hero-flex{flex-direction:column !important}
          .hero-left{max-width:100% !important}
          .hero-aside{display:none !important}
          .foot-cols{grid-template-columns:1fr !important}
          .m-row{grid-template-columns:1fr 60px 80px !important}
          .g-grid{grid-template-columns:repeat(6,1fr) !important}
          .g-w{grid-column:span 6 !important}
          .g-r{grid-column:span 3 !important}
        }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:50,padding:"0 clamp(20px,4vw,48px)",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",background:sy>50?"rgba(6,6,6,0.88)":"transparent",backdropFilter:sy>50?"blur(20px)":"none",borderBottom:sy>50?"1px solid rgba(214,209,202,0.04)":"1px solid transparent",transition:"all 0.4s cubic-bezier(0.2,0,0,1)"}}>
        <a href="#" style={{textDecoration:"none",display:"flex",alignItems:"baseline",gap:8}}>
          <span style={{fontFamily:"'EB Garamond',serif",fontSize:20,fontWeight:500,color:"#D6D1CA"}}>桜</span>
          <span style={{fontFamily:"'EB Garamond',serif",fontSize:16,fontWeight:400,color:"#D6D1CA",letterSpacing:"0.05em"}}>Sakura</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:32}}>
          <a className="nav-a" onClick={goGallery}>Gallery</a>
          <a className="nav-a" onClick={goMenu}>Menu</a>
          <a className="nav-a" href="https://sakuraasianfusion.com/reservation">Reserve</a>
          <a className="nav-a" href="https://sakuraasianfusion.com/contactus">Contact</a>
          <div style={{width:1,height:16,background:"rgba(214,209,202,0.08)"}} />
          <a className="nav-a" onClick={()=>setDrawerOpen(true)} style={{display:"flex",alignItems:"center",gap:6}}>
            Order{cnt>0&&<span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#C8788C"}}>[{cnt}]</span>}
          </a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 40%, rgba(200,120,140,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(201,169,110,0.03) 0%, transparent 40%)"}} />
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"60vw",height:"60vw",maxWidth:700,maxHeight:700,borderRadius:"50%",border:"1px solid rgba(214,209,202,0.02)",animation:"breathe 6s ease-in-out infinite"}} />
        <span className="jp" style={{top:"12%",right:"6%"}}>桜</span>
        <span className="jp" style={{bottom:"8%",left:"4%",fontSize:80}}>味</span>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 clamp(20px,4vw,48px)",width:"100%",position:"relative",zIndex:2}}>
          <div className="hero-flex" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:"4rem"}}>
            <div className="hero-left" style={{maxWidth:560}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:10,fontWeight:400,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8788C",marginBottom:32,opacity:heroLoaded?1:0,transform:heroLoaded?"none":"translateY(12px)",transition:"all 0.8s ease 0.2s"}}>
                Sushi&ensp;·&ensp;Phở&ensp;·&ensp;Hibachi&ensp;·&ensp;Thai&ensp;·&ensp;Japanese
              </div>
              <h1 style={{fontFamily:"'EB Garamond',serif",fontSize:"clamp(48px,8vw,96px)",fontWeight:400,lineHeight:0.92,letterSpacing:"-0.03em",marginBottom:32,opacity:heroLoaded?1:0,transform:heroLoaded?"none":"translateY(20px)",transition:"all 1s ease 0.35s"}}>
                <span style={{fontStyle:"italic",color:"#C8788C"}}>Sakura</span><br/>
                <span style={{fontSize:"0.45em",fontWeight:400,color:"#5A5650",letterSpacing:"0.08em",fontStyle:"normal",textTransform:"uppercase",fontFamily:"'Sora',sans-serif"}}>Asian Fusion Kitchen</span>
              </h1>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:200,lineHeight:1.8,color:"#7A756F",maxWidth:380,marginBottom:40,opacity:heroLoaded?1:0,transition:"all 1s ease 0.5s"}}>
                Fresh ingredients. Time-tested recipes. From hand-rolled sushi to twelve-hour pho broth — order online for pickup, or reserve your table.
              </p>
              <div style={{display:"flex",gap:16,alignItems:"center",opacity:heroLoaded?1:0,transition:"all 1s ease 0.65s"}}>
                <button onClick={goMenu} style={{padding:"12px 32px",background:"none",color:"#D6D1CA",border:"1px solid rgba(214,209,202,0.15)",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:400,letterSpacing:"0.12em",textTransform:"uppercase",transition:"all 0.3s"}}
                  onMouseOver={e=>{e.target.style.borderColor="rgba(200,120,140,0.4)";e.target.style.color="#C8788C"}}
                  onMouseOut={e=>{e.target.style.borderColor="rgba(214,209,202,0.15)";e.target.style.color="#D6D1CA"}}
                >View Menu</button>
                <a href="https://sakuraasianfusion.com/reservation" style={{fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:300,letterSpacing:"0.08em",color:"#5A5650",textDecoration:"none",borderBottom:"1px solid rgba(214,209,202,0.06)",paddingBottom:2}}>Reserve a Table</a>
              </div>
            </div>
            <div className="hero-aside" style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:12,opacity:heroLoaded?1:0,transition:"all 1s ease 0.8s"}}>
              {[{l:"Dine In",v:"7 days"},{l:"Pickup",v:"Online order"},{l:"Events",v:"Private dining"}].map(x=>(
                <div key={x.l} style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#3D3A36",letterSpacing:"0.06em"}}>{x.l}</div>
                  <div style={{fontFamily:"'EB Garamond',serif",fontSize:15,fontStyle:"italic",color:"#5A5650"}}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",opacity:sy>100?0:0.4,transition:"opacity 0.5s"}}>
          <div style={{width:1,height:32,background:"linear-gradient(180deg, #C8788C, transparent)"}} />
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section ref={galleryRef} style={{position:"relative"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"60px clamp(20px,4vw,48px) 20px",display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:10,fontWeight:400,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8788C",marginBottom:8}}>From Our Kitchen</div>
            <h2 style={{fontFamily:"'EB Garamond',serif",fontSize:36,fontWeight:400,fontStyle:"italic",letterSpacing:"-0.01em"}}>Gallery</h2>
          </div>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#3D3A36"}}>{GALLERY.length} photos</span>
        </div>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 clamp(20px,4vw,48px) 80px"}}>
          <div style={{height:1,background:"linear-gradient(90deg, rgba(200,120,140,0.3), rgba(214,209,202,0.04))",marginBottom:20}} />
          <div className="g-grid">
            {GALLERY.map((img, idx) => (
              <div key={idx} className={`g-cell ${img.span==="wide"?"g-w":"g-r"}`}
                style={{gridColumn:img.span==="wide"?"span 8":"span 4",aspectRatio:img.span==="wide"?"16/9":"1"}}
                onClick={()=>setLightbox(idx)}>
                <img src={img.src} alt={`${img.label} — ${img.cat}`} loading="lazy" />
                <div className="g-info">
                  <div style={{fontFamily:"'EB Garamond',serif",fontSize:16,fontWeight:400,color:"#D6D1CA",marginBottom:2}}>{img.label}</div>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"#7A756F",letterSpacing:"0.06em"}}>{img.cat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIGHTBOX ═══ */}
      {lightbox!==null&&(
        <div className="lb" onClick={()=>setLightbox(null)}>
          <button onClick={()=>setLightbox(null)} style={{position:"absolute",top:20,right:24,background:"none",border:"none",color:"#5A5650",fontFamily:"'Space Mono',monospace",fontSize:18,cursor:"pointer"}}>✕</button>
          <button className="lb-nav" style={{left:20}} onClick={e=>{e.stopPropagation();setLightbox(p=>(p-1+GALLERY.length)%GALLERY.length)}}>←</button>
          <img className="lb-img" src={GALLERY[lightbox].src} alt={GALLERY[lightbox].label} onClick={e=>e.stopPropagation()} />
          <button className="lb-nav" style={{right:20}} onClick={e=>{e.stopPropagation();setLightbox(p=>(p+1)%GALLERY.length)}}>→</button>
          <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",textAlign:"center"}}>
            <div style={{fontFamily:"'EB Garamond',serif",fontSize:20,fontStyle:"italic",color:"#D6D1CA",marginBottom:4}}>{GALLERY[lightbox].label}</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#5A5650"}}>{GALLERY[lightbox].cat}&ensp;·&ensp;{lightbox+1} / {GALLERY.length}</div>
          </div>
        </div>
      )}

      {/* ═══ MENU ═══ */}
      <section ref={menuRef} style={{maxWidth:700,margin:"0 auto",padding:"80px clamp(20px,4vw,48px) 120px"}}>
        <div style={{marginBottom:40}}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:8}}>
            <h2 style={{fontFamily:"'EB Garamond',serif",fontSize:36,fontWeight:400,fontStyle:"italic",color:"#C8788C"}}>Menu</h2>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#3D3A36"}}>{filtered.length} items</span>
          </div>
          <div style={{height:1,background:"linear-gradient(90deg, rgba(200,120,140,0.3), rgba(214,209,202,0.04))",marginBottom:24}} />
          <div style={{position:"relative",marginBottom:20}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontFamily:"'Space Mono',monospace",fontSize:12,color:"#3D3A36"}}>⌕</span>
            <input className="srch" placeholder="Search dishes" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div className="cat-track">
            {CATS.map(c=>(<button key={c} className={`f-cat ${cat===c?"on":""}`} onClick={()=>setCat(c)} style={{padding:"8px 16px"}}>{c}</button>))}
          </div>
        </div>
        {cat==="All"?grouped.map(([cn,items])=>(<div key={cn}><div className="sec-label">{cn}</div>{items.map(item=><Row key={item.id} item={item} cart={cart} add={add} upd={upd}/>)}</div>)):filtered.map(item=><Row key={item.id} item={item} cart={cart} add={add} upd={upd}/>)}
        {filtered.length===0&&(<div style={{textAlign:"center",padding:"60px 0",color:"#3D3A36"}}><div style={{fontFamily:"'EB Garamond',serif",fontSize:48,fontStyle:"italic",marginBottom:8,color:"rgba(214,209,202,0.06)"}}>空</div><div style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:300}}>No dishes match your search</div></div>)}
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{borderTop:"1px solid rgba(214,209,202,0.04)",padding:"48px clamp(20px,4vw,48px) 24px",background:"#050504"}}>
        <div className="foot-cols" style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:48,marginBottom:40}}>
          <div>
            <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:12}}>
              <span style={{fontFamily:"'EB Garamond',serif",fontSize:18,fontWeight:500}}>桜</span>
              <span style={{fontFamily:"'EB Garamond',serif",fontSize:15,fontWeight:400}}>Sakura Asian Fusion</span>
            </div>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:200,lineHeight:1.8,color:"#5A5650",maxWidth:300}}>Authentic recipes, fresh ingredients, and flavors that bring you back. Dine in, take out, or order online.</p>
          </div>
          <div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:10,fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",color:"#5A5650",marginBottom:16}}>Navigate</div>
            {[["Menu","#"],["Gallery","#"],["Reservations","https://sakuraasianfusion.com/reservation"],["Contact","https://sakuraasianfusion.com/contactus"],["About","https://sakuraasianfusion.com/abous-us"]].map(([l,u])=>(<a key={l} href={u} style={{display:"block",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:300,color:"#3D3A36",textDecoration:"none",marginBottom:8,transition:"color 0.3s"}} onMouseOver={e=>e.target.style.color="#7A756F"} onMouseOut={e=>e.target.style.color="#3D3A36"}>{l}</a>))}
          </div>
          <div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:10,fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",color:"#5A5650",marginBottom:16}}>Legal</div>
            {[["Privacy","https://sakuraasianfusion.com/privacy-policy"],["Terms","https://sakuraasianfusion.com/terms-conditions"]].map(([l,u])=>(<a key={l} href={u} style={{display:"block",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:300,color:"#3D3A36",textDecoration:"none",marginBottom:8}}>{l}</a>))}
          </div>
        </div>
        <div style={{maxWidth:1100,margin:"0 auto",borderTop:"1px solid rgba(214,209,202,0.03)",paddingTop:16,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#2A2825"}}>© 2026</span>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#2A2825"}}>sakuraasianfusion.com</span>
        </div>
      </footer>

      {/* ═══ FLOAT ORDER ═══ */}
      {cnt>0&&!drawerOpen&&(<button className="order-float" onClick={()=>setDrawerOpen(true)}><span style={{fontFamily:"'Space Mono',monospace",fontSize:10}}>[{cnt}]</span><span>View order</span><span style={{fontFamily:"'Space Mono',monospace",fontSize:11}}>${tot.toFixed(2)}</span></button>)}

      {/* ═══ CART DRAWER ═══ */}
      {drawerOpen&&<>
        <div className="overlay" onClick={()=>setDrawerOpen(false)} />
        <div className="drawer">
          <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(214,209,202,0.04)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontFamily:"'EB Garamond',serif",fontSize:20,fontWeight:400,fontStyle:"italic"}}>Order</span>
            <button onClick={()=>setDrawerOpen(false)} style={{background:"none",border:"none",color:"#5A5650",cursor:"pointer",fontFamily:"'Space Mono',monospace",fontSize:14}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}>
            {cart.length===0?(<div style={{textAlign:"center",padding:"48px 0"}}><div style={{fontFamily:"'EB Garamond',serif",fontSize:40,fontStyle:"italic",color:"rgba(214,209,202,0.05)",marginBottom:8}}>空</div><div style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:300,color:"#3D3A36"}}>Your order is empty</div></div>):placed?(<div style={{textAlign:"center",padding:"48px 0"}}><div style={{fontFamily:"'EB Garamond',serif",fontSize:40,fontStyle:"italic",color:"#C8788C",marginBottom:12}}>感謝</div><div style={{fontFamily:"'EB Garamond',serif",fontSize:22,fontStyle:"italic",marginBottom:6}}>Order placed</div><div style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:200,color:"#5A5650"}}>We're preparing your food now.</div></div>):cart.map(item=>(
              <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(214,209,202,0.03)"}}>
                <div style={{flex:1}}><div style={{fontFamily:"'EB Garamond',serif",fontSize:15,fontWeight:400}}>{item.n}</div><div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#3D3A36",marginTop:2}}>${item.p.toFixed(2)} ea</div></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button className="q-b" onClick={()=>upd(item.id,-1)}>−</button>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:12,minWidth:14,textAlign:"center"}}>{item.qty}</span>
                  <button className="q-b" onClick={()=>upd(item.id,1)}>+</button>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#C8788C",minWidth:48,textAlign:"right",marginLeft:8}}>${(item.p*item.qty).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          {cart.length>0&&!placed&&(
            <div style={{padding:"16px 24px",borderTop:"1px solid rgba(214,209,202,0.04)",background:"#080807"}}>
              {[["Subtotal",`$${tot.toFixed(2)}`],["Tax",`$${(tot*0.07).toFixed(2)}`]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:300,color:"#5A5650"}}>{l}</span><span style={{fontFamily:"'Space Mono',monospace",fontSize:12}}>{v}</span></div>))}
              <div style={{height:1,background:"rgba(214,209,202,0.04)",margin:"12px 0"}} />
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <span style={{fontFamily:"'EB Garamond',serif",fontSize:17,fontStyle:"italic"}}>Total</span>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:14,fontWeight:700}}>${(tot*1.07).toFixed(2)}</span>
              </div>
              <button onClick={()=>setPlaced(true)} style={{width:"100%",padding:"13px",background:"rgba(200,120,140,0.1)",border:"1px solid rgba(200,120,140,0.25)",color:"#C8788C",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:400,letterSpacing:"0.1em",textTransform:"uppercase",transition:"all 0.3s"}}
                onMouseOver={e=>{e.target.style.background="rgba(200,120,140,0.18)";e.target.style.borderColor="rgba(200,120,140,0.4)"}}
                onMouseOut={e=>{e.target.style.background="rgba(200,120,140,0.1)";e.target.style.borderColor="rgba(200,120,140,0.25)"}}
              >Place Order — ${(tot*1.07).toFixed(2)}</button>
            </div>
          )}
        </div>
      </>}
    </div>
  );
}

function Row({item,cart,add,upd}) {
  const ic = cart.find(c=>c.id===item.id);
  return (
    <div className="m-row">
      <div>
        <div style={{display:"flex",alignItems:"center"}}>
          <span className="m-name">{item.n}</span>
          {item.pop&&<span className="tag" style={{color:"#C9A96E",background:"rgba(201,169,110,0.08)"}}>popular</span>}
          {item.s&&<span className="tag" style={{color:"#C8384B",background:"rgba(200,56,75,0.08)"}}>spicy</span>}
        </div>
        <div className="m-desc">{item.d}</div>
      </div>
      <div className="m-price">{item.p.toFixed(2)}</div>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        {ic?(<div style={{display:"flex",alignItems:"center",gap:6}}><button className="q-b" onClick={()=>upd(item.id,-1)}>−</button><span style={{fontFamily:"'Space Mono',monospace",fontSize:12,minWidth:14,textAlign:"center"}}>{ic.qty}</span><button className="q-b" onClick={()=>upd(item.id,1)}>+</button></div>):(<button className="a-btn" onClick={()=>add(item)}>Add</button>)}
      </div>
    </div>
  );
}

export default Sakura;
