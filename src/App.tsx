import { Toast } from '@base-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import CarbonClose from '~icons/carbon/close'
import { I18nProvider } from './i18n'
import { queryClient, router } from './router'

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="relative rounded-lg bg-surface-secondary p-4"
    >
      <Toast.Title className="m-0" />
      <Toast.Description className="m-0" />

      <Toast.Close className="absolute inset-e-2 top-2 flex-center bg-transparent p-1">
        <CarbonClose width={16} height={16} />
      </Toast.Close>
    </Toast.Root>
  ))
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Toast.Provider>
          <RouterProvider router={router} />

          <Toast.Portal>
            <Toast.Viewport className="fixed top-auto right-4 bottom-4">
              <ToastList />
            </Toast.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
