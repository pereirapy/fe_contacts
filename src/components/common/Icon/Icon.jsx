import React from 'react'
import {
  faList,
  faFileExcel,
  faGlobeAmericas,
  faUserPlus,
  faPlusSquare,
  faEdit,
  faUserEdit,
  faHourglass,
  faUndo,
  faAddressCard,
  faBullhorn,
  faSearchPlus,
  faChartPie,
  faTrash,
  faFilter,
  faUser,
  faVenusMars,
  faLanguage,
  faTags,
  faBuilding,
  faMapMarkedAlt,
  faWeight,
  faSearch,
  faArrowLeft,
  faExchangeAlt,
  faTasks,
  faExclamationTriangle,
  faPhoneVolume,
  faEye,
  faSignInAlt,
  faSignOutAlt,
  faBriefcase,
  faCheckDouble,
  faUserFriends,
  faCogs,
  faSortUp,
  faSortDown,
  faSpinner,
  faPenSquare,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { EIcons } from '../../../enums/icons'

const iconMap = {
  [EIcons.fileExcelIcon]: faFileExcel,
  [EIcons.listIcon]: faList,
  [EIcons.globeAmericasIcon]: faGlobeAmericas,
  [EIcons.userPlusIcon]: faUserPlus,
  [EIcons.plusSquareIcon]: faPlusSquare,
  [EIcons.userEditIcon]: faUserEdit,
  [EIcons.editIcon]: faEdit,
  [EIcons.hourglassIcon]: faHourglass,
  [EIcons.undoIcon]: faUndo,
  [EIcons.addressCardIcon]: faAddressCard,
  [EIcons.bullhornIcon]: faBullhorn,
  [EIcons.searchPlusIcon]: faSearchPlus,
  [EIcons.chartPieIcon]: faChartPie,
  [EIcons.trashIcon]: faTrash,
  [EIcons.whatsappIcon]: faWhatsapp,
  [EIcons.filterIcon]: faFilter,
  [EIcons.userIcon]: faUser,
  [EIcons.venusMarsIcon]: faVenusMars,
  [EIcons.languageIcon]: faLanguage,
  [EIcons.tagsIcon]: faTags,
  [EIcons.buildingIcon]: faBuilding,
  [EIcons.mapMarkedAltIcon]: faMapMarkedAlt,
  [EIcons.weightIcon]: faWeight,
  [EIcons.searchIcon]: faSearch,
  [EIcons.arrowLeftIcon]: faArrowLeft,
  [EIcons.exchangeAltIcon]: faExchangeAlt,
  [EIcons.tasksIcon]: faTasks,
  [EIcons.exclamationTriangleIcon]: faExclamationTriangle,
  [EIcons.phoneVolumeIcon]: faPhoneVolume,
  [EIcons.eyeIcon]: faEye,
  [EIcons.signInAltIcon]: faSignInAlt,
  [EIcons.signOutAltIcon]: faSignOutAlt,
  [EIcons.briefcaseIcon]: faBriefcase,
  [EIcons.checkDoubleIcon]: faCheckDouble,
  [EIcons.userFriendsIcon]: faUserFriends,
  [EIcons.cogsIcon]: faCogs,
  [EIcons.sortUp]: faSortUp,
  [EIcons.sortDown]: faSortDown,
  [EIcons.spinner]: faSpinner,
  [EIcons.penSquare]: faPenSquare,
  [EIcons.pencilAlt]: faPencilAlt,
}

export default function IconComponent({
  name,
  noMarginRight,
  label,
  position = 'left',
  animate = false,
}) {
  const marginClass = noMarginRight ? '' : position === 'left' ? 'mr-1' : 'ml-1'
  return (
    <span className={marginClass}>
      {position === 'right' && label ? `${label} ` : ''}
      {name && iconMap[name] && (
        <FontAwesomeIcon icon={iconMap[name]} spin={animate} />
      )}
      {position === 'left' && label ? ` ${label}` : ''}
    </span>
  )
}
