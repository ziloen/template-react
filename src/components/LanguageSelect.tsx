import { Combobox, Tooltip } from '@base-ui/react'
import { supportedLngs, useI18n } from '~/i18n'
import { formatLanguageName } from '~/utils/intl'

export function LanguageSelect() {
  const { i18n, changeLanguage, fetchingLanguage } = useI18n()

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
          {(v: string) => formatLanguageName(v, { language: i18n.language })}
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
            <Combobox.Input className="" />

            <Tooltip.Provider delay={200}>
              <Combobox.List>
                {(l: string) => (
                  <Tooltip.Root key={l}>
                    <Tooltip.Trigger
                      render={
                        <Combobox.Item
                          key={l}
                          value={l}
                          className="flex justify-between gap-2"
                        >
                          <span>{formatLanguageName(l, { language: l })}</span>
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
                          <span>
                            {formatLanguageName(l, { language: i18n.language })}
                          </span>
                        </Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )}
              </Combobox.List>
            </Tooltip.Provider>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
