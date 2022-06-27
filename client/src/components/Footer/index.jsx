import { DefaultFooter } from '@ant-design/pro-layout'
import { useIntl } from 'umi'

const Footer = () => {
  const intl = useIntl()
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '计算机科学与技术19-2班-张如明'
  })
  const currentYear = new Date().getFullYear()
  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} />
}

export default Footer
