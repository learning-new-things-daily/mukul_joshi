import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals'

function storeMetric(name, value){
  const key = '__web_vitals__'
  const prev = JSON.parse(localStorage.getItem(key) || '{}')
  const arr = prev[name] || []
  const next = arr.concat({ t: Date.now(), v: value })
  prev[name] = next.slice(-20)
  localStorage.setItem(key, JSON.stringify(prev))
  document.dispatchEvent(new CustomEvent('web-vitals-updated', { detail: prev }))
}

export function initWebVitals(){
  try{
    onCLS(m => storeMetric('CLS', m.value))
    onFID(m => storeMetric('FID', m.value))
    onLCP(m => storeMetric('LCP', m.value))
    onTTFB(m => storeMetric('TTFB', m.value))
  } catch(e){
    // no-op on error
  }
}

export function readVitals(){
  try{ return JSON.parse(localStorage.getItem('__web_vitals__') || '{}') } catch{ return {} }
}
