import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { CollectionItem } from '../data'

export default function Lightbox({ item, onClose }: { item: CollectionItem | null; onClose: () => void }) {
  return (
    <Dialog.Root open={Boolean(item)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-overlay" />
        {item && (
          <Dialog.Content className="lightbox-content">
            <Dialog.Close className="lightbox-close" aria-label="Close image"><X size={22} /></Dialog.Close>
            <img src={item.image} alt={`${item.name} wedding styling`} />
            <div className="lightbox-caption">
              <div>
                <Dialog.Title>{item.name}</Dialog.Title>
                <Dialog.Description>{item.description}</Dialog.Description>
              </div>
              <span>{item.source}</span>
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  )
}
