/**
 * 验证工具函数
 */

import { REGEX } from '../constants';
import type { ValidationResult, ValidationError } from '../types/common';

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  return REGEX.EMAIL.test(email);
}

/**
 * 验证手机号格式
 */
export function validatePhone(phone: string): boolean {
  return REGEX.PHONE.test(phone);
}

/**
 * 验证密码强度
 */
export function validatePassword(password: string): boolean {
  return REGEX.PASSWORD.test(password);
}

/**
 * 验证用户名格式
 */
export function validateUsername(username: string): boolean {
  return REGEX.USERNAME.test(username);
}

/**
 * 验证 URL 格式
 */
export function validateUrl(url: string): boolean {
  return REGEX.URL.test(url);
}

/**
 * 验证必填字段
 */
export function validateRequired(value: any, fieldName: string): ValidationError | null {
  if (value === null || value === undefined || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} 是必填项`,
      value,
    };
  }
  return null;
}

/**
 * 验证字符串长度
 */
export function validateLength(
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): ValidationError | null {
  if (min !== undefined && value.length < min) {
    return {
      field: fieldName,
      message: `${fieldName} 长度不能少于 ${min} 个字符`,
      value,
    };
  }
  
  if (max !== undefined && value.length > max) {
    return {
      field: fieldName,
      message: `${fieldName} 长度不能超过 ${max} 个字符`,
      value,
    };
  }
  
  return null;
}

/**
 * 验证数字范围
 */
export function validateRange(
  value: number,
  fieldName: string,
  min?: number,
  max?: number
): ValidationError | null {
  if (min !== undefined && value < min) {
    return {
      field: fieldName,
      message: `${fieldName} 不能小于 ${min}`,
      value,
    };
  }
  
  if (max !== undefined && value > max) {
    return {
      field: fieldName,
      message: `${fieldName} 不能大于 ${max}`,
      value,
    };
  }
  
  return null;
}

/**
 * 验证邮箱字段
 */
export function validateEmailField(email: string, fieldName = '邮箱'): ValidationError | null {
  const requiredError = validateRequired(email, fieldName);
  if (requiredError) return requiredError;
  
  if (!validateEmail(email)) {
    return {
      field: fieldName,
      message: '请输入有效的邮箱地址',
      value: email,
    };
  }
  
  return null;
}

/**
 * 验证密码字段
 */
export function validatePasswordField(password: string, fieldName = '密码'): ValidationError | null {
  const requiredError = validateRequired(password, fieldName);
  if (requiredError) return requiredError;
  
  const lengthError = validateLength(password, fieldName, 8, 50);
  if (lengthError) return lengthError;
  
  if (!validatePassword(password)) {
    return {
      field: fieldName,
      message: '密码必须包含大小写字母和数字，长度至少8位',
      value: password,
    };
  }
  
  return null;
}

/**
 * 验证用户名字段
 */
export function validateUsernameField(username: string, fieldName = '用户名'): ValidationError | null {
  const requiredError = validateRequired(username, fieldName);
  if (requiredError) return requiredError;
  
  const lengthError = validateLength(username, fieldName, 3, 20);
  if (lengthError) return lengthError;
  
  if (!validateUsername(username)) {
    return {
      field: fieldName,
      message: '用户名只能包含字母、数字和下划线',
      value: username,
    };
  }
  
  return null;
}

/**
 * 验证手机号字段
 */
export function validatePhoneField(phone: string, fieldName = '手机号'): ValidationError | null {
  if (!phone) return null; // 手机号通常是可选的
  
  if (!validatePhone(phone)) {
    return {
      field: fieldName,
      message: '请输入有效的手机号码',
      value: phone,
    };
  }
  
  return null;
}

/**
 * 批量验证
 */
export function validateFields(validators: Array<() => ValidationError | null>): ValidationResult {
  const errors: ValidationError[] = [];
  
  for (const validator of validators) {
    const error = validator();
    if (error) {
      errors.push(error);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证确认密码
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
  fieldName = '确认密码'
): ValidationError | null {
  const requiredError = validateRequired(confirmPassword, fieldName);
  if (requiredError) return requiredError;
  
  if (password !== confirmPassword) {
    return {
      field: fieldName,
      message: '两次输入的密码不一致',
      value: confirmPassword,
    };
  }
  
  return null;
}
