import koaRouter from 'koa-router';

import accessAction from '../action/access';
import accessValidate from '../validator/access';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

/**
  * @apiDefine userObject
  * @apiSuccess  {String} _id Users id
  * @apiSuccess  {String} email Email
  * @apiSuccess  {String} lastName Last name
  * @apiSuccess  {String} firstName First name
  * @apiSuccess  {String[]} roles User access roles
  * @apiSuccess  {Boolean} isDeleted Is user deleted
  * @apiSuccess  {String} createdAt User create date
  * @apiSuccess  {String} updatedAt User update date
  * @apiSuccess  {String} accessToken User access token
  * @apiSuccess  {String} [refreshToken] User refresh token
*/

export const router = koaRouter({
  prefix: '/api/v1/access',
});

/**

  * @apiName RegisterUser
  * @api {POST} /api/v1/access/register Registration

  * @apiVersion 0.0.1

  * @apiGroup Access

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} email Email
  * @apiParam  {String{5,20}} password Password
  * @apiParam  {String} firstName First name
  * @apiParam  {String} lastName Last name


  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:3000/api/v1/access/register'
  *      -H "Content-Type: application/json"
  *      -X POST
  *      -d  '{"email":"vasya@ya.com","password":"123456","firstName":"Vasya","lastName":"Pupkin"}'

  * @apiSuccessExample {json} Success-Response:
  {
    "accessToken": "+fUPIAwNdRK2d5g8mv3FOyYFW14FiKlsZRXSLCl2oUZZ3zM3I1wDTdUoI0S7Yl/ECkDO7/2bRa9kStJR9rQkler/G8BruDgUvHHqsspyUoxSS885jS10VykrSuCzCQ==",
    "refreshToken": "wLpCvQxtuqoYEYPBxtp6GWZzac8ZPJ4XRKABhHFnsJ7CD4Ws4va5dQdrC2aRT5TW4Nvc6bHqfpkBY5qnsFu5NGtrGoHQjs84Z6AwRefqdaNU6McnkaFWkCdQpkTzwUtxqNRodFLyhWyDYXssSMApciakPT2GJfD88H3zhwHMzBsNgcj4nuJeUyjbE8PvhuMK3ZV8rWhXc3Pe3HTfgeMJHCF3rne2kssFHVCcw3BhS29Nf9oUHFftadpFtKEW4j7m",
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": false,
    "roles": [
     "user"
    ],
    "_id": "591c0cc5407eba1706aeb43e",
    "email": "test2@mail.com",
    "firstName": "testAdmin",
    "lastName": "testAdmin"
  }

  * @apiUse userObject

  * @apiErrorExample {json} Error-Response:
    [{param: "email", message: "Valid email is required" }]

  * @apiError {Object} InvalidEmail { param: "email", message: "Valid email is required" }
  * @apiError {Object} EmailExist { param: "email", message: "There is an existing user connected to this email" }
  * @apiError {Object} PasswordSize { param: "password", message: "Password must be between 5-20 characters long" }
  * @apiError {Object} FirstNameRequired { param: "firstName", message: "First Name is required" }
  * @apiError {Object} LastNameRequired { param: "lastName", message: "Last Name is required" }
*/

router.post('/register', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const regData = await accessValidate.register(req.request.body);
    return accessAction.register(regData);
  });
});

/**

  * @apiName forgotPassword
  * @api {POST} /api/v1/access/forgot Forgot password

  * @apiVersion 0.0.1

  * @apiGroup Access

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} email Email

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:3000/api/v1/access/forgot'
  *      -H "Content-Type: application/json"
  *      -X POST
  *      -d  '{"email":"vasya@ya.com"}'

  * @apiSuccessExample {json} Success-Response:
  {
    "result": "success"
  }

  * @apiSuccess  {String='success'} result Result type

  * @apiErrorExample {json} Error-Response:
  [{ param: "email", message: "Valid email is required" }]

  * @apiError {Object} InvalidEmail { param: "email", message: "Valid email is required" }
  * @apiError {Object} UserNotFound { param: "email", message: "User not found" }

*/

router.post('/forgot', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const regData = await accessValidate.forgot(req.request.body);
    return accessAction.forgot(regData);
  });
});

/**

  * @apiName LoginUser
  * @api {POST} /api/v1/access/login Login

  * @apiVersion 0.0.1

  * @apiGroup Access

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} email Email
  * @apiParam  {String} password Password

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:3000/api/v1/access/login'
  *      -H "Content-Type: application/json"
  *      -X POST
  *      -d  '{"email":"vasya@ya.com","password":"123456"}'

  * @apiSuccessExample {json} Success-Response:
  {
    "accessToken": "+fUPIAwNdRK2d5g8mv3FOyYFW14FiKlsZRXSLCl2oUZZ3zM3I1wDTdUoI0S7Yl/ECkDO7/2bRa9kStJR9rQkler/G8BruDgUvHHqsspyUoxSS885jS10VykrSuCzCQ==",
    "refreshToken": "wLpCvQxtuqoYEYPBxtp6GWZzac8ZPJ4XRKABhHFnsJ7CD4Ws4va5dQdrC2aRT5TW4Nvc6bHqfpkBY5qnsFu5NGtrGoHQjs84Z6AwRefqdaNU6McnkaFWkCdQpkTzwUtxqNRodFLyhWyDYXssSMApciakPT2GJfD88H3zhwHMzBsNgcj4nuJeUyjbE8PvhuMK3ZV8rWhXc3Pe3HTfgeMJHCF3rne2kssFHVCcw3BhS29Nf9oUHFftadpFtKEW4j7m",
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": false,
    "roles": [
      "user"
    ],
    "_id": "591c0cc5407eba1706aeb43e",
    "email": "test2@mail.com",
    "firstName": "testAdmin",
    "lastName": "testAdmin"
  }
  * @apiUse userObject

  * @apiErrorExample {json} Error-Response:
    [{ param: "email", message: "Valid email is required" }]

  * @apiError {Object} InvalidEmail { param: "email", message: "Valid email is required" }
  * @apiError {Object} InvalidPassword { param: "password", message: "Valid password is required" }
  * @apiError {Object} UserNotFound { param: "email", message: "User not found" }
  * @apiError {Object} PasswordIsNotCorrect { param: "password", message: "User password is not correct" }
*/

router.post('/login', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const regData = await accessValidate.login(req.request.body);
    return accessAction.login(regData);
  });
});

/**

  * @apiName refreshToken
  * @api {POST} /api/v1/access/refreshToken Refresh access token

  * @apiVersion 0.0.1

  * @apiGroup Access

  * @apiHeader {String} Content-Type=application/json Content-Type

  * @apiParam  {String} refreshToken User refresh token

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:3000/api/v1/access/login'
  *      -H "Content-Type: application/json"
  *      -X POST
  *      -d  '{"refreshToken":"6dcpum9bWgVGx5VSTtgiwc2x8nFs6muxpk82FVcKDChqhgiKKM4L8nEKHgpZXjUqjdGUWWnrzBmjciAK5vG2zcyMjxku3r3sxjWAGVuWdvBN3fJory3G5fjPedQAJYFFryckhqpomQ4gMX7AXjubxdv9MEsVuuiagYEqyZvVi3mJeoUyuVv5SnxoTMafbedKJ2bMqh2Cm5hnisxYoTnNU6CaCgMwBB25NxaMnfpfZVy5tcz95vRqfTBumV9r8pe2"}'

  * @apiSuccessExample {json} Success-Response:
  {
    "accessToken": "ljxlZhWUjO7hVwP+r8rYjOCCvhvtrIQbcDPrXZQFmjkrcpYPriHRl2jc/8YEIL0ThjXcAdYtstlVuojR1eT/xhBoayc42NeFIL6uTAF36MkomIeInyPuJDfXmxXTLw=="
  }

 * @apiSuccess  {String} accessToken User access token
 * @apiSuccess  {String} [refreshToken] User refresh token

  * @apiErrorExample {json} Error-Response:
  [{ param: "refreshToken", message: "Valid refresh token is required" }]

  * @apiError {Object} InvalidRefreshToken { param: "refreshToken", message: "Valid refresh token is required" }
  * @apiError {Object} UserNotFound { param: "refreshToken", message: "User not found" }

*/

router.post('/refreshToken', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const regData = await accessValidate.refreshToken(req.request.body);
    return accessAction.refreshToken(regData);
  });
});

export const router2 = koaRouter({
  prefix: '/api/v1/authAccess',
});

router2.all('/*', bearerMiddleware);

/**

  * @apiName loginConfirm
  * @api {GET} /api/v1/authAccess/loginConfirm Check access token

  * @apiVersion 0.0.1

  * @apiGroup Access

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:3000/api/v1/authAccess/loginConfirm'
  *      -H "Content-Type: application/json"
  *      -H "Authorization: Bearer u5YnSW0kgUj9bTEXf2uX93IR4NgX9TrqCUR3Y5DFO5eJZgSAxLYU5zIL4PUDKdSM1vOZ3vVgzINaaWhYFpFzbuc0/wzHU6Iq6NWW9qHXy174W7rYbhDpeMi4E5uPrg=="
  *      -X GET

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-17T08:41:41.510Z",
    "isDeleted": false,
    "roles": [
      "user"
    ],
    "_id": "591c0cc5407eba1706aeb43e",
    "email": "test2@mail.com",
    "firstName": "testAdmin",
    "lastName": "testAdmin"
  }

  * @apiUse userObject

  * @apiErrorExample {json} Error-Response:
  [{message: "User not found", param : 'accessToken'}]

  * @apiUse accessTokenError
*/

router2.get('/loginConfirm', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => accessAction.loginConfirm(req.request.user));
});

/**

  * @apiName changePassword
  * @api {POST} /api/v1/authAccess/changePassword Change user password

  * @apiVersion 0.0.1

  * @apiGroup Access

  * @apiHeader {String} Content-Type=application/json Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} password Password
  * @apiParam  {String} oldPassword Old password

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:3000/api/v1/authAccess/changePassword'
  *      -H "Content-Type: application/json"
  *      -H "Authorization: Bearer u5YnSW0kgUj9bTEXf2uX93IR4NgX9TrqCUR3Y5DFO5eJZgSAxLYU5zIL4PUDKdSM1vOZ3vVgzINaaWhYFpFzbuc0/wzHU6Iq6NWW9qHXy174W7rYbhDpeMi4E5uPrg=="
  *      -X POST
  *      -d  '{"password":"test","oldPassword":"test"}'

  * @apiSuccessExample {json} Success-Response:
  {
    "result": "success"
  }

  * @apiSuccess  {String='success'} result Result type

  * @apiErrorExample {json} Error-Response:
  [{ param : 'accessToken', message : 'User not found'}]

  * @apiError {Object} PasswordSize { param: "password", message: "Password must be between 5-20 characters long" }
  * @apiError {Object} OldPasswordSize { param: "password", message: "Old password must be between 5-20 characters long" }
  * @apiError {Object} UserNotFound { param : 'accessToken', message : 'User not found'}
  * @apiError {Object} OldPasswordIsNotCorrect { param : 'oldPassword', message : 'User old password is not correct'}
  * @apiUse accessTokenError

*/

router2.post('/changePassword', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const password = await accessValidate.changePassword(req.request.body, req.request.user);
    return accessAction.changePassword(password, req.request.user);
  });
});
