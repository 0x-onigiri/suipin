import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import '@/index.css'
import { Provider } from '@/provider'
import { Layout } from '@/components/common/layout'
import TopPage from '@/pages/top/page'
import PickerPage from '@/pages/picker/page'

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<TopPage />} />
              <Route path="/:pickerId" element={<PickerPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  )
