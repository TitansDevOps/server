import { config } from 'src/config';

const LANGUAGE_ENGLISH = 'english';

const message = {
  outputEnglishMessages: {
    success: 'Success',
    error: 'Error',

    userCreated: 'User created correctly',
    successLogin: 'Success login',
    userAlreadyExist: 'User already exists with this email',
    emailIsWrong: 'email is wrong',
    passwordIsWrong: 'password is wrong',
    userNotFound: 'User not found',
    errorUpdateUser: 'Error editing user',

    fullNameString: 'Invalid full name data type',
    fullNameRequired: 'Full name is required',
    fullNameMinLength: 'Full name must be at least 1 character long',
    invalidEmail: 'Invalid email',
    emailRequired: 'Email is required',
    passwordString: 'Invalid password data type',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters long',
    passwordPattern: 'Password must contain at least one letter and one number',
    createdAtRequired: 'Created at is required',
    isActiveBoolean: 'isActive must be a boolean value',
    isActiveRequired: 'isActive is required',
    phoneString: 'Invalid phone data type',
    phoneRequired: 'Phone is required',
    addressString: 'Invalid address data type',
    addressRequired: 'Address is required',
    creditPointsNumber: 'Credit points must be a number',
    creditPointsRequired: 'Credit points is required',
    roleString: 'Invalid role data type',
    roleRequired: 'Role is required',

    tokenNoProvide: 'Token not provided',
    userRoleMissing: 'User role is missing',
    invalidToken: 'Invalid or expired token',

    mailSendFail: 'Error sending mail',
    mailSendSuccess: 'Mail sent successfully',
    resetEmailSent: 'Reset email sent successfully',
    passwordResetSuccess: 'Password reset successfully',
    updateUser: 'User updated successfully',

    successFileUpload: 'File uploaded successfully',
    errorFileUpload: 'You must upload at least one file',
    successFileDelete: 'Files deleted successfully',

    errorFileEntityNotFound: 'File entity not found',
    errorFileNotFound: 'File not found',
    errorGettingFilePath: 'Error getting file path',
    successCreateDisk: 'Disk created successfully',

    diskPreexistent: 'Disks already exist in this server',
    errorInvalidFileFormat: 'Invalid file format',
  },

  outputSpanishMessages: {
    success: 'Success',
    error: 'Error',

    userCreated: 'Usuario creado correctamente',
    successLogin: 'Inicio de sesión exitoso',
    userAlreadyExist: 'Ya existe un usuario con este correo electronico.',
    emailIsWrong: 'No existe niguna cuenta con este correo electronico',
    passwordIsWrong: 'Contraseña incorrecta',
    userNotFound: 'El usuario no existe',
    errorUpdateUser: 'Ocurrió un error editando el usuario',

    fullNameString: 'Tipo de dato de nombre completo inválido',
    fullNameRequired: 'El nombre completo es obligatorio',
    fullNameMinLength: 'El nombre completo debe tener al menos 1 caracter',
    invalidEmail: 'Email inválido',
    emailRequired: 'El email es obligatorio',
    passwordString: 'Tipo de dato de contraseña inválido',
    passwordRequired: 'La contraseña es obligatoria',
    passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
    passwordPattern:
      'La contraseña debe contener al menos una letra y un número',
    createdAtRequired: 'La fecha de creación es obligatoria',
    isActiveBoolean: 'isActive debe ser un valor booleano',
    isActiveRequired: 'isActive es obligatorio',
    phoneString: 'Tipo de dato de teléfono inválido',
    phoneRequired: 'El teléfono es obligatorio',
    addressString: 'Tipo de dato de dirección inválido',
    addressRequired: 'La dirección es obligatoria',
    creditPointsNumber: 'Los puntos de crédito deben ser un número',
    creditPointsRequired: 'Los puntos de crédito son obligatorios',
    roleString: 'Tipo de dato de rol inválido',
    roleRequired: 'El rol es obligatorio',

    tokenNoProvide: 'No se envío el token de autenticación',
    userRoleMissing: 'No se encontro el rol',
    invalidToken: 'El token no es valido o expiró.',

    mailSendFail: 'Error al enviar el correo',
    mailSendSuccess: 'Correo enviado exitosamente',
    resetEmailSent: 'Correo de restablecimiento enviado exitosamente',
    passwordResetSuccess: 'Contraseña restablecida exitosamente',
    updateUser: 'Usuario actualizado exitosamente',

    successFileUpload: 'Archivos subidos correctamente',
    errorFileUpload: 'Debe subir al menos un archivo',
    successFileDelete: 'Los archivos se han eliminado correctamente',
    errorFileEntityNotFound: 'Entidad de archivo no encontrada',

    errorFileNotFound: 'Archivo no encontrado',
    errorGettingFilePath: 'Error al obtener la ruta del archivo',
    successCreateDisk: 'Disco creado correctamente',

    diskPreexistent: 'Los discos ya existen en este servidor',
    errorInvalidFileFormat: 'Formato de archivo no válido',
  },
};

export const messages =
  config.language == LANGUAGE_ENGLISH
    ? message.outputEnglishMessages
    : message.outputSpanishMessages;
