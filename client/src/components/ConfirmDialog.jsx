import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

// ConfirmDialog provides a specialized modal for destructive or critical user actions.
export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-3xl bg-slate-900 p-8 text-center align-middle shadow-2xl transition-all border border-slate-800">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-900/20 mb-6">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500" aria-hidden="true" />
                </div>
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-white tracking-tight mb-2">
                  {title}
                </Dialog.Title>
                <p className="text-sm text-slate-400 px-2">{message}</p>

                <div className="mt-8 flex flex-col gap-2">
                  <button
                    type="button"
                    className="btn-danger w-full py-2.5 font-bold"
                    onClick={onConfirm}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Delete Permanently'}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost w-full py-2.5 font-medium"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
