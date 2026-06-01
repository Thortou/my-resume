// ===========================================
// ຄ່າຄົງທີ່ຂອງແອັບພລິເຄຊັນ
// ===========================================

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ເລີ່ມຕົ້ນ Full Stack';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ===========================================
// ຄ່າເລີ່ມຕົ້ນການແບ່ງໜ້າ
// ===========================================

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ===========================================
// ປ້າຍຊື່ບົດບາດ
// ===========================================

export const ROLE_LABELS = {
  ADMIN: 'ຜູ້ບໍລິຫານ',
  USER: 'ຜູ້ໃຊ້',
} as const;

// ===========================================
// ເສັ້ນທາງ
// ===========================================

export const ROUTES = {
  // ເສັ້ນທາງສາທາລະນະ
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRODUCTS: '/products',
  LOGIN: '/login',

  // ເສັ້ນທາງທີ່ຕ້ອງເຂົ້າສູ່ລະບົບ
  CHAT: '/chat',

  // ເສັ້ນທາງຜູ້ບໍລິຫານ
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_BANNERS: '/admin/banners',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// ===========================================
// ຈຸດປາຍທາງ API
// ===========================================

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  UPLOAD: '/api/upload',
} as const;

// ===========================================
// ຂໍ້ຄວາມສະຖານະ
// ===========================================

export const MESSAGES = {
  // ຂໍ້ຄວາມສຳເລັດ
  LOGIN_SUCCESS: 'ເຂົ້າສູ່ລະບົບສຳເລັດ',
  LOGOUT_SUCCESS: 'ອອກຈາກລະບົບສຳເລັດ',
  CREATE_SUCCESS: 'ສ້າງສຳເລັດແລ້ວ',
  UPDATE_SUCCESS: 'ອັບເດດສຳເລັດແລ້ວ',
  DELETE_SUCCESS: 'ລຶບສຳເລັດແລ້ວ',
  UPLOAD_SUCCESS: 'ອັບໂຫລດສຳເລັດ',
  CONTACT_SUCCESS: 'ຂອບໃຈສຳລັບຂໍ້ຄວາມຂອງທ່ານ! ພວກເຮົາຈະຕອບກັບທ່ານໄວໆນີ້.',

  // ຂໍ້ຄວາມຜິດພາດ
  LOGIN_FAILED: 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
  UNAUTHORIZED: 'ທ່ານບໍ່ມີສິດໃນການດຳເນີນການນີ້',
  NOT_FOUND: 'ບໍ່ພົບຊັບພະຍາກອນ',
  SERVER_ERROR: 'ມີບາງຢ່າງຜິດພາດ. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ',
  VALIDATION_ERROR: 'ກະລຸນາກວດເບິ່ງແບບຟອມເພື່ອຫາຂໍ້ຜິດພາດ',
  UPLOAD_FAILED: 'ອັບໂຫລດລົ້ມເຫລວ. ກະລຸນາລອງໃໝ່',
  CONTACT_FAILED: 'ສົ່ງຂໍ້ຄວາມລົ້ມເຫລວ. ກະລຸນາລອງໃໝ່.',
  SPAM_DETECTED: 'ຂໍ້ຄວາມຂອງທ່ານຖືກໝາຍວ່າເປັນ spam. ກະລຸນາລອງໃໝ່.',

  // ຂໍ້ຄວາມຢືນຢັນ
  DELETE_CONFIRM: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລາຍການນີ້?',
  LOGOUT_CONFIRM: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອອກຈາກລະບົບ?',
} as const;

// ===========================================
// ຄ່າຄົງທີ່ການກວດສອບ
// ===========================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
} as const;

// ===========================================
// ຄ່າຄົງທີ່ການອັບໂຫລດໄຟລ໌
// ===========================================

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// ===========================================
// ຄ່າຄົງທີ່ຮູບແບບວັນທີ
// ===========================================

export const DATE_FORMATS = {
  DATE: 'dd MMM, yyyy',
  DATE_TIME: 'dd MMM, yyyy HH:mm',
  TIME: 'HH:mm',
  INPUT: 'yyyy-MM-dd',
} as const;

// ===========================================
// ຄ່າຄົງທີ່ໂຟນເດີ Cloudinary
// ===========================================

export const CLOUDINARY_FOLDERS = {
  USERS: 'full-stack-starter/users',
  PRODUCTS: 'full-stack-starter/products',
  BANNERS: 'full-stack-starter/banners',
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
