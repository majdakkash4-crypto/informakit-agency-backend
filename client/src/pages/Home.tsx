import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Bot, Palette, TrendingUp, Share2, Smartphone, Lightbulb, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

// ─── Keyframe animations as inline styles ──────────────────────
const heroStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,900;1,700;1,900&display=swap');

@keyframes blurIn{from{filter:blur(12px);opacity:0;transform:translateY(-20px)}to{filter:blur(0);opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounce{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,7px)}}
@keyframes sheen{from{left:-100%}to{left:200%}}
@keyframes orbDriftA{0%,100%{transform:translate(-50%,-50%) translate(0,0) scale(1)}33%{transform:translate(-50%,-50%) translate(80px,-40px) scale(1.1)}66%{transform:translate(-50%,-50%) translate(-50px,60px) scale(0.95)}}
@keyframes orbDriftB{0%,100%{transform:translate(-50%,-50%) translate(0,0) scale(1)}50%{transform:translate(-50%,-50%) translate(-90px,30px) scale(1.15)}}
@keyframes orbDriftC{0%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0.9)}40%{transform:translate(-50%,-50%) translate(60px,80px) scale(1.05)}80%{transform:translate(-50%,-50%) translate(-40px,-60px) scale(1)}}
@keyframes pulseRing{0%{transform:translate(-50%,-50%) scale(0.6);opacity:0.6}100%{transform:translate(-50%,-50%) scale(1.4);opacity:0}}
@keyframes gridShift{0%,100%{background-position:0 0}50%{background-position:30px 30px}}
@keyframes floatChip{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-12px) rotate(var(--rot,0deg))}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

.hero-wrap{position:relative;width:100%;min-height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;font-family:'Inter',sans-serif;padding-bottom:160px}
.hero-grid-bg{position:absolute;inset:0;z-index:0;pointer-events:none;background-size:60px 60px;background-image:linear-gradient(to right,rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.035) 1px,transparent 1px);mask-image:radial-gradient(ellipse at center,black 30%,transparent 75%);-webkit-mask-image:radial-gradient(ellipse at center,black 30%,transparent 75%);animation:gridShift 14s ease-in-out infinite}
.hero-orb{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none;z-index:1;will-change:transform}
.orb-1{top:30%;left:25%;width:420px;height:420px;background:radial-gradient(circle,rgba(139,92,246,0.55) 0%,rgba(139,92,246,0) 70%);animation:orbDriftA 18s ease-in-out infinite}
.orb-2{top:60%;left:75%;width:480px;height:480px;background:radial-gradient(circle,rgba(217,70,239,0.45) 0%,rgba(217,70,239,0) 70%);animation:orbDriftB 22s ease-in-out infinite}
.orb-3{top:75%;left:30%;width:340px;height:340px;background:radial-gradient(circle,rgba(56,189,248,0.30) 0%,rgba(56,189,248,0) 70%);animation:orbDriftC 20s ease-in-out infinite}
.hero-pulse{position:absolute;top:50%;left:50%;width:300px;height:300px;border:1px solid rgba(139,92,246,0.20);border-radius:50%;pointer-events:none;z-index:2;animation:pulseRing 4s ease-out infinite}
.hero-pulse:nth-child(5){animation-delay:1.3s;border-color:rgba(217,70,239,0.18)}
.hero-pulse:nth-child(6){animation-delay:2.6s;border-color:rgba(56,189,248,0.15)}

.hero-top{position:absolute;top:0;left:0;right:0;padding:22px 30px;display:flex;align-items:center;justify-content:space-between;z-index:10}
.hero-logo{display:flex;align-items:center;gap:9px;white-space:nowrap;animation:fadeUp 0.5s ease-out both;animation-delay:0.05s;cursor:pointer}
.hero-logo-dot{width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#8B5CF6,#D946EF);box-shadow:0 0 16px rgba(139,92,246,0.6)}
.hero-logo-name{font-size:16px;font-weight:600;color:#fff;letter-spacing:-0.2px}

.hero-center{position:relative;z-index:5;text-align:center;line-height:0.82;letter-spacing:-0.03em;user-select:none}
.blur-row{display:flex;justify-content:center}
.blur-letter{display:inline-block;font-family:'Fira Code',monospace;font-weight:700;font-size:clamp(60px,14vw,118px);background:linear-gradient(135deg,#8B5CF6,#D946EF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:blurIn 0.5s ease-out both;text-shadow:0 0 40px rgba(139,92,246,0.5)}
.l2 .blur-letter{background:none;-webkit-background-clip:unset;background-clip:unset;-webkit-text-fill-color:rgba(255,255,255,0.20);color:rgba(255,255,255,0.20);text-shadow:none}

.hero-pretitle{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:9999px;background:rgba(139,92,246,0.10);border:1px solid rgba(139,92,246,0.25);backdrop-filter:blur(10px);margin-bottom:32px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#fff;font-family:'Fira Code',monospace;animation:fadeUp 0.6s ease-out 0.2s both}
.hero-pretitle::before{content:'';width:5px;height:5px;border-radius:50%;background:#8B5CF6;box-shadow:0 0 8px rgba(139,92,246,0.8)}

.hero-tagline{font-size:clamp(16px,2.5vw,22px);color:rgba(255,255,255,0.38);font-weight:500;margin-top:28px;letter-spacing:0.01em;animation:fadeUp 0.6s ease-out 0.8s both}
.hero-ctas{display:flex;gap:14px;justify-content:center;margin-top:36px;animation:fadeUp 0.6s ease-out 1s both}
.hero-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:9999px;font-size:14px;font-weight:700;letter-spacing:0.02em;cursor:pointer;border:none;transition:all 0.2s}
.hero-cta svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;transition:transform 0.2s}
.hero-cta.primary{background:linear-gradient(135deg,#8B5CF6,#D946EF);color:#fff;box-shadow:0 6px 24px rgba(139,92,246,0.45)}
.hero-cta.primary:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(139,92,246,0.6)}
.hero-cta.primary:hover svg{transform:translateX(3px)}
.hero-cta.secondary{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.12)}
.hero-cta.secondary:hover{background:rgba(255,255,255,0.10);color:#fff}

.hero-stats{position:relative;z-index:5;display:flex;gap:48px;margin-top:64px;animation:fadeUp 0.6s ease-out 1.2s both}
.hero-stat{text-align:center}
.hero-stat-num{font-family:'Fira Code',monospace;font-size:28px;font-weight:700;background:linear-gradient(135deg,#8B5CF6,#D946EF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero-stat-label{font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:rgba(255,255,255,0.30);margin-top:4px;font-family:'Fira Code',monospace}

.hero-chip{position:absolute;z-index:3;padding:8px 14px;border-radius:9999px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(10px);font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);display:flex;align-items:center;gap:6px;pointer-events:none;animation:floatChip 6s ease-in-out infinite}
.hero-chip span{font-family:'Fira Code',monospace;font-size:11px}
.hero-chip-a{top:22%;left:8%;animation-delay:0s}
.hero-chip-b{top:18%;right:8%;animation-delay:1.5s}
.hero-chip-c{bottom:28%;left:6%;animation-delay:3s}
.hero-chip-d{bottom:22%;right:6%;animation-delay:4.5s}

.hero-scroll{display:none}
.hero-scroll-label{font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:'Fira Code',monospace}
.hero-scroll svg{width:20px;height:20px;stroke:rgba(255,255,255,0.25);fill:none;stroke-width:2;stroke-linecap:round}

.hero-side-label{position:absolute;z-index:4;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.12);font-family:'Fira Code',monospace;writing-mode:vertical-lr}
.hero-side-label.left{left:20px;top:50%;transform:translateY(-50%) rotate(180deg)}
.hero-side-label.right{right:20px;top:50%;transform:translateY(-50%)}

.hero-corner{position:absolute;width:40px;height:40px;z-index:4;pointer-events:none}
.hero-corner::before,.hero-corner::after{content:'';position:absolute;background:rgba(255,255,255,0.08)}
.hero-corner.tl{top:16px;left:16px}.hero-corner.tl::before{width:20px;height:1px;top:0;left:0}.hero-corner.tl::after{width:1px;height:20px;top:0;left:0}
.hero-corner.tr{top:16px;right:16px}.hero-corner.tr::before{width:20px;height:1px;top:0;right:0}.hero-corner.tr::after{width:1px;height:20px;top:0;right:0}
.hero-corner.bl{bottom:16px;left:16px}.hero-corner.bl::before{width:20px;height:1px;bottom:0;left:0}.hero-corner.bl::after{width:1px;height:20px;bottom:0;left:0}
.hero-corner.br{bottom:16px;right:16px}.hero-corner.br::before{width:20px;height:1px;bottom:0;right:0}.hero-corner.br::after{width:1px;height:20px;bottom:0;right:0}

/* Floating nav bar */
.floating-container{position:fixed;bottom:28px;left:0;right:0;margin-left:auto;margin-right:auto;width:fit-content;z-index:9999;display:flex;flex-direction:column;align-items:center;gap:16px;animation:fadeUp 0.7s ease-out both;animation-delay:1.2s;opacity:0}
.anfrage-btn-wrap{position:relative}
.anfrage-btn{position:relative;cursor:pointer;border:none;overflow:hidden;border-radius:9999px;height:62px;min-width:266px;background:linear-gradient(135deg,rgba(139,92,246,0.72),rgba(217,70,239,0.68));border:1px solid rgba(255,255,255,0.32);backdrop-filter:blur(20px) saturate(180%);box-shadow:0 6px 28px rgba(139,92,246,0.50),inset 0 1.5px 0 rgba(255,255,255,0.38),inset 0 -1px 0 rgba(0,0,0,0.12);display:flex;align-items:center;justify-content:flex-start;padding:7px;transition:box-shadow 0.2s,transform 0.15s}
.anfrage-btn:hover{transform:translateY(-2px);box-shadow:0 14px 44px rgba(139,92,246,0.65),inset 0 1.5px 0 rgba(255,255,255,0.42)}
.anfrage-circle{width:48px;height:48px;border-radius:50%;flex-shrink:0;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;transition:width 0.45s cubic-bezier(0.4,0,0.2,1);overflow:hidden}
.anfrage-btn:hover .anfrage-circle{width:calc(100% - 14px);border-radius:9999px}
.anfrage-circle svg{width:22px;height:22px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;flex-shrink:0;transition:transform 0.35s}
.anfrage-btn:hover .anfrage-circle svg{transform:translateX(4px)}
.anfrage-label{position:absolute;left:50%;transform:translateX(-36%);font-size:18px;font-weight:700;letter-spacing:0.02em;color:#fff;white-space:nowrap;pointer-events:none;transition:opacity 0.25s}
.anfrage-btn:hover .anfrage-label{opacity:0}
.anfrage-btn::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)}
.anfrage-btn:hover::before{animation:sheen 0.55s ease forwards}
.anfrage-glow{position:absolute;bottom:-14px;left:10%;width:80%;height:18px;background:linear-gradient(135deg,#8B5CF6,#D946EF);filter:blur(16px);opacity:0.50;border-radius:50%;pointer-events:none;transition:opacity 0.2s}
.anfrage-btn-wrap:hover .anfrage-glow{opacity:0.75}

.floating-bar{display:flex;align-items:center;gap:11px;padding:7px 14px;border-radius:9999px;background:rgba(20,20,20,0.80);border:1px solid rgba(255,255,255,0.18);backdrop-filter:blur(24px) saturate(200%);box-shadow:0 4px 24px rgba(0,0,0,0.55),inset 0 1.5px 0 rgba(255,255,255,0.22),inset 0 -1px 0 rgba(0,0,0,0.08);white-space:nowrap}
.bar-nav{position:relative;display:flex;align-items:center}
.bar-nav-cursor{position:absolute;top:0;height:100%;border-radius:9999px;background:linear-gradient(135deg,rgba(139,92,246,0.55),rgba(217,70,239,0.50));border:1px solid rgba(255,255,255,0.25);box-shadow:0 2px 10px rgba(139,92,246,0.35),inset 0 1px 0 rgba(255,255,255,0.3);z-index:1;transition:left 0.25s cubic-bezier(0.4,0,0.2,1),width 0.25s cubic-bezier(0.4,0,0.2,1),opacity 0.2s;pointer-events:none}
.bar-nav-item{position:relative;z-index:2;cursor:pointer;padding:10px 18px;font-size:15px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:rgba(255,255,255,0.32);border-radius:9999px;border:none;background:none;transition:color 0.2s;user-select:none}
.bar-nav-item:hover,.bar-nav-item.b-active{color:rgba(255,255,255,0.85)}

/* Sections */
.scroll-section{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 40px;background:#000}
.scroll-title{text-align:center;margin-bottom:60px}
.scroll-title p{font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.38);font-family:'Fira Code',monospace;margin-bottom:12px}
.scroll-title h2{font-size:clamp(32px,5vw,56px);font-weight:900;font-style:italic;color:#fff;line-height:1.05;letter-spacing:-0.03em}
.scroll-title h2 span{background:linear-gradient(135deg,#8B5CF6,#D946EF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

/* Services section */
.services-section{padding:100px 40px;background:#000}
.services-label{font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.38);font-family:'Fira Code',monospace;text-align:center;margin-bottom:60px}
.service-item{display:flex;align-items:center;justify-content:space-between;padding:40px 0;border-top:0.5px solid rgba(255,255,255,0.06)}
.service-item h2{font-size:clamp(36px,6vw,72px);font-weight:900;font-style:italic;color:#fff;letter-spacing:-0.03em}

/* Leistungen cards */
.leistungen-section{padding:100px 40px;background:#000}
.leistungen-title{text-align:center;margin-bottom:60px}
.leistungen-title p{font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.38);font-family:'Fira Code',monospace;margin-bottom:12px}
.leistungen-title h2{font-size:clamp(32px,5vw,56px);font-weight:900;font-style:italic;color:#fff;line-height:1.05;letter-spacing:-0.03em}
.leistungen-title h2 span{background:linear-gradient(135deg,#8B5CF6,#D946EF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

.gc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;max-width:1200px;margin:0 auto}
.gc{position:relative;border-radius:16px;overflow:hidden;min-height:320px;cursor:pointer;transition:transform 0.4s,box-shadow 0.4s;perspective:600px}
.gc:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 20px 60px rgba(139,92,246,0.25)}
.gc-bg{position:absolute;inset:0;background:#0a0a0a;z-index:0}
.gc-glow{position:absolute;inset:0;z-index:1;opacity:0.7;transition:opacity 0.4s}
.gc:hover .gc-glow{opacity:1}
.gc-glass{position:absolute;inset:0;z-index:2;background:rgba(0,0,0,0.35);backdrop-filter:blur(2px)}
.gc-content{position:relative;z-index:5;padding:32px;display:flex;flex-direction:column;height:100%}
.gc-icon-wrap{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:20px}
.gc-icon-wrap svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.gc-tag{font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.35);font-family:'Fira Code',monospace;margin-bottom:12px}
.gc-title{font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:10px}
.gc-desc{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;flex:1}
.gc-desc em{color:rgba(255,255,255,0.75);font-style:italic}
.gc-link{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);text-decoration:none;margin-top:16px;transition:color 0.2s}
.gc-link:hover{color:#fff}
.gc-link svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}
.gc-line-b,.gc-line-l,.gc-line-r,.gc-noise{position:absolute;inset:0;z-index:3;pointer-events:none}

/* Bottom CTA */
.lc-bottom{text-align:center;margin-top:60px;padding:48px;border-radius:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)}
.lc-bottom-title{font-size:22px;font-weight:800;color:#fff;margin-bottom:12px}
.lc-bottom-desc{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;max-width:500px;margin:0 auto 24px}
.lc-bottom-desc em{color:rgba(255,255,255,0.65);font-style:italic}
.lc-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:9999px;font-size:14px;font-weight:700;cursor:pointer;border:none;background:linear-gradient(135deg,#8B5CF6,#D946EF);color:#fff;box-shadow:0 6px 24px rgba(139,92,246,0.45);transition:all 0.2s}
.lc-cta:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(139,92,246,0.6)}

/* Zahlen section */
.zahlen-section{padding:100px 40px;background:#000}
.zahlen-header{text-align:center;margin-bottom:60px}
.zahlen-header h2{font-size:clamp(28px,4vw,48px);font-weight:900;font-style:italic;color:#fff;letter-spacing:-0.03em}
.zahlen-header h2 em{background:linear-gradient(135deg,#8B5CF6,#D946EF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-style:italic}
.zahlen-header p{font-size:14px;color:rgba(255,255,255,0.38);margin-top:12px}
.zahlen-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:1000px;margin:0 auto}
.zahlen-cell{text-align:center;padding:40px 24px;border-radius:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)}
.zahlen-tag{font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.30);font-family:'Fira Code',monospace}
.zahlen-num{display:flex;align-items:baseline;justify-content:center;gap:4px;margin:16px 0}
.zahlen-big{font-family:'Fira Code',monospace;font-size:64px;font-weight:700;line-height:1}
.grad-1{background:linear-gradient(135deg,#3B82F6,#6366f1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.grad-2{background:linear-gradient(135deg,#f97316,#ef4444);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.grad-3{background:linear-gradient(135deg,#10b981,#06b6d4);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.zahlen-suffix{font-size:18px;font-weight:700;color:rgba(255,255,255,0.18);font-family:'Fira Code',monospace}
.zahlen-desc{font-size:13px;color:rgba(255,255,255,0.38);line-height:1.6}
.zahlen-desc em{color:rgba(255,255,255,0.6);font-style:italic}

/* Footer */
.footer-wrap{position:relative;background:#000;overflow:hidden;padding-bottom:40px}
.footer-aurora{position:absolute;top:0;left:0;right:0;height:300px;background:linear-gradient(180deg,rgba(139,92,246,0.15) 0%,transparent 100%);pointer-events:none}
.footer-bg-text{position:absolute;bottom:60px;left:50%;transform:translateX(-50%);font-size:clamp(80px,15vw,200px);font-weight:900;font-style:italic;color:rgba(255,255,255,0.02);white-space:nowrap;pointer-events:none;letter-spacing:-0.05em}
.footer-marquee-wrap{overflow:hidden;padding:20px 0;border-top:0.5px solid rgba(255,255,255,0.06);border-bottom:0.5px solid rgba(255,255,255,0.06)}
.footer-marquee-track{display:flex;gap:40px;animation:marquee 30s linear infinite;width:max-content}
.footer-marquee-item{display:flex;align-items:center;gap:12px;white-space:nowrap;font-size:14px;font-weight:600;color:rgba(255,255,255,0.25)}
.footer-marquee-dot{width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#8B5CF6,#D946EF)}
.footer-main{position:relative;z-index:10;text-align:center;padding:80px 40px}
.footer-heading{font-size:clamp(32px,5vw,56px);font-weight:900;font-style:italic;color:#fff;letter-spacing:-0.03em;margin-bottom:32px}
.footer-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-bottom:40px}
.footer-pill{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:9999px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);text-decoration:none;transition:all 0.2s}
.footer-pill:hover{background:rgba(255,255,255,0.08);color:#fff}
.footer-pill svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.footer-pill.primary{background:linear-gradient(135deg,rgba(139,92,246,0.20),rgba(217,70,239,0.15));border-color:rgba(139,92,246,0.35);color:#fff}
.footer-pill.primary:hover{background:linear-gradient(135deg,rgba(139,92,246,0.30),rgba(217,70,239,0.25))}
.footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.footer-link{padding:8px 16px;border-radius:9999px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.35);text-decoration:none;transition:all 0.2s}
.footer-link:hover{color:rgba(255,255,255,0.75);background:rgba(255,255,255,0.08)}
.footer-bottom{position:relative;z-index:10;padding:24px 40px 0;border-top:0.5px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-copy{font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:rgba(255,255,255,0.22);font-family:'Fira Code',monospace}
.footer-scroll-top{width:44px;height:44px;border-radius:50%;cursor:pointer;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.40);transition:all 0.3s}
.footer-scroll-top:hover{background:rgba(139,92,246,0.2);border-color:rgba(139,92,246,0.4);color:#fff;transform:translateY(-2px)}
.footer-scroll-top svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

@media(max-width:768px){
  .hero-chip{display:none}
  .hero-side-label{display:none}
  .hero-stats{gap:20px;flex-wrap:wrap;justify-content:center}
  .hero-stat-num{font-size:22px}
  .gc-grid{grid-template-columns:1fr}
  .zahlen-grid{grid-template-columns:1fr}
  .service-item{flex-direction:column;gap:20px;text-align:center}
  .footer-pills{flex-direction:column;align-items:center}
  .floating-container{bottom:16px;width:calc(100% - 32px);left:16px;right:16px;margin:0}
  .anfrage-btn{min-width:unset;width:100%;height:54px;justify-content:center}
  .anfrage-label{position:relative;left:unset;transform:none;font-size:16px}
  .anfrage-circle{position:absolute;left:12px}
  .anfrage-btn:hover .anfrage-label{opacity:1}
  .anfrage-btn:hover .anfrage-circle{width:44px;border-radius:50%}
  .floating-bar{justify-content:space-between;padding:4px 8px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .floating-bar::-webkit-scrollbar{display:none}
  .bar-nav-item{padding:9px 10px;font-size:12px;letter-spacing:0.03em}
  .theme-btn{min-width:42px;height:36px;padding:3px}
  .theme-btn-label{display:none}
  .theme-btn-circle{width:28px;height:28px}
  .theme-btn:hover .theme-btn-circle{width:calc(100% - 6px)}
  .leistungen-title h2{font-size:clamp(28px,7vw,42px)}
  .footer-main{padding:60px 20px}
  .footer-bottom{padding:20px 20px 0;flex-direction:column;align-items:center;text-align:center}
}
@media(max-width:480px){
  .bar-nav-item{padding:8px 8px;font-size:11px}
  .anfrage-btn{height:50px}
  .anfrage-label{font-size:15px}
  .zahlen-big{font-size:48px}
  .hero-ctas{flex-direction:column;align-items:center;gap:10px}
  .hero-cta{width:100%;max-width:280px;justify-content:center}
}

/* -- Light mode: white + anthracite -- */
html:not(.dark) .hero-wrap{background:#ffffff!important}
html:not(.dark) .hero-grid-bg{background-image:linear-gradient(to right,rgba(0,0,0,0.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.06) 1px,transparent 1px)}
html:not(.dark) .hero-orb.orb-1,html:not(.dark) .hero-orb.orb-2,html:not(.dark) .hero-orb.orb-3{opacity:0.25!important}
html:not(.dark) .hero-pulse{border-color:rgba(139,92,246,0.15)!important}
html:not(.dark) .blur-letter{text-shadow:none}
html:not(.dark) .l2 .blur-letter{-webkit-text-fill-color:rgba(0,0,0,0.08)!important;color:rgba(0,0,0,0.08)!important}
html:not(.dark) .hero-tagline{color:#333333!important}
html:not(.dark) .hero-pretitle{background:rgba(109,40,217,0.07);border-color:rgba(109,40,217,0.20);color:#4C1D95}
html:not(.dark) .hero-stat-label{color:#555555!important}
html:not(.dark) .hero-side-label{color:rgba(0,0,0,0.15)!important}
html:not(.dark) .hero-corner::before,html:not(.dark) .hero-corner::after{background:rgba(0,0,0,0.15)}
html:not(.dark) .hero-chip{background:rgba(0,0,0,0.05);border-color:rgba(0,0,0,0.10);color:#444444}
html:not(.dark) .floating-bar{background:rgba(255,255,255,0.95)!important;border-color:rgba(0,0,0,0.12)!important;box-shadow:0 4px 20px rgba(0,0,0,0.10)!important}
html:not(.dark) .bar-nav-item{color:#555555!important}
html:not(.dark) .bar-nav-item:hover,html:not(.dark) .bar-nav-item.b-active{color:#111111!important}
html:not(.dark) .bar-nav-cursor{background:rgba(109,40,217,0.10)!important;border-color:rgba(109,40,217,0.18)!important;box-shadow:none!important}
html:not(.dark) .hero-cta.secondary{background:rgba(0,0,0,0.06)!important;color:#222222!important;border-color:rgba(0,0,0,0.15)!important}
html:not(.dark) .leistungen-section{background:#f5f5f5!important}
html:not(.dark) .leistungen-title p{color:#7C3AED!important}
html:not(.dark) .leistungen-title h2{color:#111111!important}
html:not(.dark) .leistungen-title h2 span{color:#7C3AED!important}
html:not(.dark) .gc-bg{background:#ffffff!important}
html:not(.dark) .gc-glow{opacity:0.12!important}
html:not(.dark) .gc-glass{background:rgba(255,255,255,0.70)!important}
html:not(.dark) .gc-tag{color:#7C3AED!important}
html:not(.dark) .gc-title{color:#111111!important}
html:not(.dark) .gc-desc{color:#444444!important}
html:not(.dark) .gc-desc em{color:#7C3AED!important}
html:not(.dark) .gc-icon-wrap{background:rgba(0,0,0,0.07)!important}
html:not(.dark) .lc-cta{background:linear-gradient(135deg,#7C3AED,#A855F7)!important}
html:not(.dark) .lc-bottom-title{color:#111111!important}
html:not(.dark) .lc-bottom-desc{color:#555555!important}
html:not(.dark) .zahlen-section{background:#eeeeee!important}
html:not(.dark) .zahlen-header h2{color:#111111!important}
html:not(.dark) .zahlen-header h2 em{color:#7C3AED!important}
html:not(.dark) .zahlen-header p{color:#555555!important}
html:not(.dark) .zahlen-cell{background:rgba(255,255,255,0.80)!important;border-color:rgba(0,0,0,0.08)!important}
html:not(.dark) .zahlen-tag{color:#7C3AED!important}
html:not(.dark) .zahlen-desc{color:#444444!important}
html:not(.dark) .zahlen-desc em{color:#7C3AED!important}
html:not(.dark) .footer-wrap{background:#111111!important}

/* -- no vintage overlay -- */
.vintage-overlay{display:none}
.vintage-overlay.visible{display:none}
.vintage-overlay::before{content:'';position:absolute;inset:0;background:rgba(160,100,20,0.18);mix-blend-mode:multiply}
.vintage-overlay::after{content:'';position:absolute;inset:0;opacity:0.30;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");background-repeat:repeat;background-size:300px 300px;mix-blend-mode:overlay}

/* ── Theme-toggle button (anfrage-style) ── */
.theme-btn{position:relative;cursor:pointer;border:none;overflow:hidden;border-radius:9999px;height:40px;min-width:126px;background:linear-gradient(135deg,rgba(139,92,246,0.70),rgba(217,70,239,0.65));border:1px solid rgba(255,255,255,0.28);backdrop-filter:blur(16px) saturate(180%);box-shadow:0 4px 16px rgba(139,92,246,0.40),inset 0 1.5px 0 rgba(255,255,255,0.32),inset 0 -1px 0 rgba(0,0,0,0.10);display:flex;align-items:center;justify-content:flex-start;padding:5px;transition:box-shadow 0.2s,transform 0.15s}
.theme-btn:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(139,92,246,0.55),inset 0 1.5px 0 rgba(255,255,255,0.36)}
.theme-btn-circle{width:30px;height:30px;border-radius:50%;flex-shrink:0;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;transition:width 0.42s cubic-bezier(0.4,0,0.2,1);overflow:hidden;color:#fff}
.theme-btn:hover .theme-btn-circle{width:calc(100% - 10px);border-radius:9999px}
.theme-btn-label{position:absolute;left:52%;transform:translateX(-40%);font-size:13px;font-weight:700;letter-spacing:0.04em;color:#fff;white-space:nowrap;pointer-events:none;transition:opacity 0.22s}
.theme-btn:hover .theme-btn-label{opacity:0}
.theme-btn::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent);pointer-events:none}
.theme-btn:hover::before{animation:sheen 0.50s ease forwards}

/* ── Theme slide transition overlay ── */
.theme-wipe{position:fixed;inset:0;z-index:99998;pointer-events:none;transform:translateX(-100%)}
@keyframes wipe-in{0%{transform:translateX(-100%)}50%{transform:translateX(0)}100%{transform:translateX(110%)}}
.theme-wipe.animating{animation:wipe-in 0.55s cubic-bezier(0.76,0,0.24,1) forwards}
`;

const letterDelays1 = [0.10, 0.17, 0.24, 0.31, 0.38, 0.45, 0.52, 0.59, 0.66, 0.73];
const letterDelays2 = [0.16, 0.23, 0.30, 0.37, 0.44, 0.51, 0.58, 0.65, 0.72, 0.79];
const INFORMAKIT = "INFORMAKIT".split("");

export default function Home() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isWiping, setIsWiping] = useState(false);
  const barNavRef = useRef<HTMLDivElement>(null);
  const barCursorRef = useRef<HTMLDivElement>(null);

  const handleThemeToggle = () => {
    if (isWiping) return;
    setIsWiping(true);
    setTimeout(() => toggleTheme?.(), 275);
    setTimeout(() => setIsWiping(false), 600);
  };
  const [activeSection, setActiveSection] = useState("home");

  const scrollTo = (target: string) => {
    const map: Record<string, string> = {
      home: "section-home",
      leistungen: "section-leistungen",
      projekte: "section-projekte",
      ueber: "section-ueber",
      kontakt: "section-kontakt",
    };
    const el = document.getElementById(map[target] || "");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(target);
  };

  const moveBarCursor = (el: HTMLElement | null) => {
    if (!el || !barCursorRef.current) return;
    barCursorRef.current.style.left = el.offsetLeft + "px";
    barCursorRef.current.style.width = el.offsetWidth + "px";
    barCursorRef.current.style.opacity = "1";
  };

  useEffect(() => {
    const items = barNavRef.current?.querySelectorAll<HTMLElement>(".bar-nav-item");
    const active = barNavRef.current?.querySelector<HTMLElement>(".b-active");
    if (active) setTimeout(() => moveBarCursor(active), 500);

    const handleScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.4;
      const sections = [
        { id: "section-home", target: "home" },
        { id: "section-leistungen", target: "leistungen" },
        { id: "section-projekte", target: "projekte" },
        { id: "section-ueber", target: "ueber" },
        { id: "section-kontakt", target: "kontakt" },
      ];
      let current = "home";
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= y) current = s.target;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const active = barNavRef.current?.querySelector<HTMLElement>(".b-active");
    if (active) moveBarCursor(active);
  }, [activeSection]);

  return (
    <div style={{ width: "100%", fontFamily: "'Inter', sans-serif" }}>
      <div className={`theme-wipe${isWiping ? " animating" : ""}`} style={{ background: theme === "dark" ? "#ffffff" : "#000" }} />
      <div className={`vintage-overlay${theme !== "dark" ? " visible" : ""}`} />
      <style>{heroStyles}</style>

      {/* ═══════ HERO ═══════ */}
      <div className="hero-wrap" id="section-home">
        <div className="hero-grid-bg" />
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-orb orb-3" />
        <div className="hero-pulse" />
        <div className="hero-pulse" />
        <div className="hero-pulse" />

        <div className="hero-corner tl" />
        <div className="hero-corner tr" />
        <div className="hero-corner bl" />
        <div className="hero-corner br" />

        <div className="hero-side-label left">// digitale agentur · seit 2024</div>
        <div className="hero-side-label right">// based in · germany</div>

        <div className="hero-chip hero-chip-a">⚡ <span>14 Tage Build</span></div>
        <div className="hero-chip hero-chip-b">🎯 <span>3× mehr Anfragen</span></div>
        <div className="hero-chip hero-chip-c">🚀 <span>100% Custom</span></div>
        <div className="hero-chip hero-chip-d">⚙ <span>KI-Automation</span></div>

        {/* Top nav — NO status badge */}
        <div className="hero-top">
          <div className="hero-logo" onClick={() => scrollTo("home")}>
            <div className="hero-logo-dot" />
            <span className="hero-logo-name">informakit</span>
          </div>
        </div>

        {/* Center text */}
        <div className="hero-center">
          <div className="hero-pretitle">// digitale agentur</div>
          <div className="blur-row l1">
            {INFORMAKIT.map((letter, i) => (
              <span key={`l1-${i}`} className="blur-letter" style={{ animationDelay: `${letterDelays1[i]}s` }}>
                {letter}
              </span>
            ))}
          </div>
          <div className="blur-row l2">
            {INFORMAKIT.map((letter, i) => (
              <span key={`l2-${i}`} className="blur-letter" style={{ animationDelay: `${letterDelays2[i]}s` }}>
                {letter}
              </span>
            ))}
          </div>
          <p className="hero-tagline">Digitale Strategien. Klare Ergebnisse.</p>
          <div className="hero-ctas">
            <button className="hero-cta primary" onClick={() => navigate("/anfrage")}>
              Projekt starten
              <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
            <button className="hero-cta secondary" onClick={() => scrollTo("leistungen")}>
              Leistungen ansehen
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat"><div className="hero-stat-num">3×</div><div className="hero-stat-label">anfragen</div></div>
          <div className="hero-stat"><div className="hero-stat-num">14</div><div className="hero-stat-label">tage build</div></div>
          <div className="hero-stat"><div className="hero-stat-num">100%</div><div className="hero-stat-label">custom</div></div>
          <div className="hero-stat"><div className="hero-stat-num">24h</div><div className="hero-stat-label">antwortzeit</div></div>
        </div>

        <button className="hero-scroll" onClick={() => scrollTo("leistungen")}>
          <span className="hero-scroll-label">scroll</span>
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>

      {/* ═══════ LEISTUNGEN ═══════ */}
      <div className="leistungen-section" id="section-leistungen">
        <div className="leistungen-title">
          <p>Was wir bauen</p>
          <h2>Von Idee bis <span>Launch.</span></h2>
        </div>
        <div className="gc-grid">
          {[
            { tag: "01 · automatisierung", title: "ki & automatisierungen", desc: 'Zapier, Make, n8n, GPT — <em>spare 10h pro Woche.</em>', icon: <Bot size={20} color="rgba(255,255,255,0.85)" />, gradient: "radial-gradient(ellipse at bottom right,rgba(99,102,241,0.75) -10%,transparent 70%),radial-gradient(ellipse at bottom left,rgba(56,189,248,0.65) -10%,transparent 70%)" },
            { tag: "02 · branding", title: "branding & design-system", desc: 'Logo, Farbe, Typografie — <em>wiedererkennbar</em> gemacht.', icon: <Palette size={20} color="rgba(255,255,255,0.85)" />, gradient: "radial-gradient(ellipse at bottom right,rgba(239,68,68,0.70) -10%,transparent 70%),radial-gradient(circle at bottom center,rgba(249,115,22,0.60) -20%,transparent 60%)" },
            { tag: "03 · seo", title: "seo & performance", desc: 'Google findet dich — <em>und versteht</em> dich.', icon: <TrendingUp size={20} color="rgba(255,255,255,0.85)" />, gradient: "radial-gradient(ellipse at bottom right,rgba(172,92,255,0.75) -10%,transparent 70%),radial-gradient(ellipse at bottom left,rgba(217,70,239,0.65) -10%,transparent 70%)" },
            { tag: "04 · content", title: "social media & content", desc: 'Content mit Haltung — <em>echte Anfragen</em> statt Likes.', icon: <Share2 size={20} color="rgba(255,255,255,0.85)" />, gradient: "radial-gradient(ellipse at bottom right,rgba(16,185,129,0.70) -10%,transparent 70%),radial-gradient(ellipse at bottom left,rgba(5,150,105,0.55) -10%,transparent 70%)" },
            { tag: "05 · mobile", title: "mobile apps", desc: 'iOS + Android + Web. Von MVP bis <em>App-Store-Release.</em>', icon: <Smartphone size={20} color="rgba(255,255,255,0.85)" />, gradient: "radial-gradient(ellipse at bottom right,rgba(249,115,22,0.70) -10%,transparent 70%),radial-gradient(circle at bottom center,rgba(239,68,68,0.55) -20%,transparent 60%)" },
            { tag: "06 · strategie", title: "digital consulting", desc: 'Sparring für Gründer. <em>Klarheit vor Aktion.</em>', icon: <Lightbulb size={20} color="rgba(255,255,255,0.85)" />, gradient: "radial-gradient(ellipse at bottom right,rgba(6,182,212,0.70) -10%,transparent 70%),radial-gradient(ellipse at bottom left,rgba(8,145,178,0.55) -10%,transparent 70%)" },
          ].map((card, i) => (
            <div className="gc" key={i}>
              <div className="gc-bg" />
              <div className="gc-glow" style={{ background: card.gradient }} />
              <div className="gc-glass" />
              <div className="gc-content">
                <div className="gc-icon-wrap">{card.icon}</div>
                <span className="gc-tag">{card.tag}</span>
                <div className="gc-title">{card.title}</div>
                <div className="gc-desc" dangerouslySetInnerHTML={{ __html: card.desc }} />
              </div>
            </div>
          ))}
        </div>
        <div className="lc-bottom">
          <div className="lc-bottom-title">du brauchst etwas anderes?</div>
          <div className="lc-bottom-desc">Chatbot, Dashboard, interne Tools — <em>frag uns einfach.</em></div>
          <button className="lc-cta" onClick={() => navigate("/anfrage")}>projekt beschreiben →</button>
        </div>
      </div>

      {/* ═══════ ZAHLEN ═══════ */}
      <div className="zahlen-section" id="section-ueber">
        <div className="zahlen-header">
          <h2><em>zahlen,</em> die uns etwas sagen —</h2>
          <p>messbar. nicht geschätzt. das ist der unterschied.</p>
        </div>
        <div className="zahlen-grid">
          <div className="zahlen-cell">
            <span className="zahlen-tag">01 · anfragen</span>
            <div className="zahlen-num"><div className="zahlen-big grad-1">3</div><div className="zahlen-suffix">×</div></div>
            <div className="zahlen-desc">mehr Anfragen im Schnitt nach dem Relaunch — gemessen in den ersten <em>90 Tagen.</em></div>
          </div>
          <div className="zahlen-cell">
            <span className="zahlen-tag">02 · tempo</span>
            <div className="zahlen-num"><div className="zahlen-big grad-2">14</div><div className="zahlen-suffix">tage</div></div>
            <div className="zahlen-desc">vom Briefing bis zur fertigen Website — <em>kein endloses Wartespiel.</em></div>
          </div>
          <div className="zahlen-cell">
            <span className="zahlen-tag">03 · maßarbeit</span>
            <div className="zahlen-num"><div className="zahlen-big grad-3">100</div><div className="zahlen-suffix">%</div></div>
            <div className="zahlen-desc">individuell entwickelt. keine Templates. <em>null Recycling.</em></div>
          </div>
        </div>
      </div>

      {/* ═══════ FOOTER ═══════ */}
      <div className="footer-wrap" id="section-kontakt">
        <div className="footer-aurora" />
        <div className="footer-bg-text">INFORMAKIT</div>
        <div style={{ padding: "80px 0 0", position: "relative", zIndex: 10 }}>
          <div className="footer-marquee-wrap">
            <div className="footer-marquee-track">
              {["KI & Automatisierung", "Branding & Design", "Web Development", "Social Media", "SEO & Performance", "Mobile Apps", "Digital Consulting", "KI & Automatisierung", "Branding & Design", "Web Development", "Social Media", "SEO & Performance", "Mobile Apps"].map((item, i) => (
                <div className="footer-marquee-item" key={i}><div className="footer-marquee-dot" /><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-main">
          <h2 className="footer-heading">Bereit loszulegen?</h2>
          <div className="footer-pills">
            <a href="#" className="footer-pill primary" onClick={(e) => { e.preventDefault(); navigate("/anfrage"); }}>
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Projekt anfragen
            </a>
            <a href="mailto:hallo@informakit.de" className="footer-pill">
              <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              hallo@informakit.de
            </a>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo("leistungen"); }}>Leistungen</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo("ueber"); }}>Über uns</a>
            <a href="#" className="footer-link">Datenschutz</a>
            <a href="#" className="footer-link">Impressum</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 informakit.de — alle Rechte vorbehalten</div>
          <button className="footer-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
          </button>
        </div>
      </div>

      {/* ═══════ FLOATING NAV ═══════ */}
      <div className="floating-container">
        <div className="anfrage-btn-wrap">
          <button className="anfrage-btn" onClick={() => navigate("/anfrage")}>
            <div className="anfrage-circle">
              <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </div>
            <span className="anfrage-label">Anfrage erstellen</span>
          </button>
          <div className="anfrage-glow" />
        </div>
        <div className="floating-bar">
          <div style={{ position: "relative" }}>
            <div className="bar-nav-cursor" ref={barCursorRef} style={{ opacity: 0, width: 0, left: 0 }} />
            <div className="bar-nav" ref={barNavRef}>
              {["home", "leistungen", "ueber", "kontakt"].map((target) => (
                <button
                  key={target}
                  className={`bar-nav-item ${activeSection === target ? "b-active" : ""}`}
                  onClick={() => scrollTo(target)}
                  onMouseEnter={(e) => moveBarCursor(e.currentTarget)}
                  onMouseLeave={() => {
                    const active = barNavRef.current?.querySelector<HTMLElement>(".b-active");
                    if (active) moveBarCursor(active);
                  }}
                >
                  {target === "home" ? "Home" : target === "leistungen" ? "Leistungen" : target === "ueber" ? "Über uns" : "Kontakt"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", margin: "0 6px" }} />
          <button className="theme-btn" onClick={handleThemeToggle}>
            <div className="theme-btn-circle">
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </div>
            <span className="theme-btn-label">{theme === "dark" ? "Hell" : "Dunkel"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


