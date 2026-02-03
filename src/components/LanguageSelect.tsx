import { Combobox, Tooltip } from '@base-ui/react'
import { getLanguageDisplayName, supportedLngs, useI18n } from '~/i18n'

export function LanguageSelect() {
  const { i18n, changeLanguage, fetchingLanguage } = useI18n()

  const languageItems = useMemo(() => {
    return supportedLngs.map((l) => (
      <Tooltip.Root key={l}>
        <Tooltip.Trigger
          render={
            <Combobox.Item
              key={l}
              value={l}
              className="flex justify-between gap-2"
            >
              <span>{getLanguageDisplayName(l, l)}</span>
            </Combobox.Item>
          }
        />

        <Tooltip.Portal>
          <Tooltip.Positioner
            side="inline-start"
            sideOffset={4}
            align="start"
            collisionAvoidance={{ side: 'none' }}
          >
            <Tooltip.Popup className="bg-surface-secondary px-1.5 py-0.5">
              <span>{getLanguageDisplayName(l, i18n.language)}</span>
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    ))
  }, [i18n.language])

  return (
    <Combobox.Root
      items={supportedLngs}
      value={i18n.language}
      onValueChange={(value) => {
        if (!value) return
        changeLanguage(value)
      }}
    >
      <Combobox.Trigger className="btn">
        <Combobox.Value>
          {(v: string) => getLanguageDisplayName(v, i18n.language)}
        </Combobox.Value>

        {fetchingLanguage ? (
          <span className="ms-1 ascii-loader-dots duration-2000" />
        ) : (
          <Combobox.Icon className="ms-1 font-mono" />
        )}
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner side="bottom" align="end" sideOffset={4}>
          <Combobox.Popup className="border bg-surface-primary px-1 py-2">
            <Combobox.List>
              <Tooltip.Provider delay={200}>{languageItems}</Tooltip.Provider>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
