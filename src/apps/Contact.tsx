import { useState } from 'preact/hooks'
import { site } from '../lib/content'
import { L, t } from '../lib/i18n'
import { Socials } from './ui'

export function Contact() {
  const [copied, setCopied] = useState(false)
  const email = site.contact.email
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* no clipboard */ }
  }
  return (
    <div class="app contact">
      <h1>{t('contact')}</h1>
      <p class="lead">{L(site.contact.availability)}</p>
      {email ? (
        <div class="mail">
          <a class="btn primary" href={`mailto:${email}`}>{email}</a>
          <button class="btn" onClick={copy}>{copied ? t('copied') : t('copy')}</button>
        </div>
      ) : (
        <p class="muted">{t('pending')}: e-mail</p>
      )}
      <Socials />
    </div>
  )
}
