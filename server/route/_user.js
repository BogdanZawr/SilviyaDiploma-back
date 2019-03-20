import koaRouter from 'koa-router';

import userAction from '../action/user';
import userValidate from '../validator/user';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/user',
});

router.all('/*', bearerMiddleware);

/**

  * @apiName UpdateUser
  * @api {PUT} /api/v1/user/update User update

  * @apiVersion 0.0.1

  * @apiGroup user

  * @apiHeader {String} Content-Type=multipart/form-data Content-Type
  * @apiHeader {String} Authorization User bearer access token

  * @apiParam  {String} [email] Email
  * @apiParam  {String} [firstName] First name
  * @apiParam  {String} [lastName] Last name

  * @apiExample {curl} Example usage:
  *     curl 'http://localhost:3000/api/v1/user/update'
  *      -H "Content-Type: application/json"
  *      -X PUT
  *      -d  '{"email":"vasya@ya.com","firstName":"Vasya","lastName":"Pupkin"}'

  * @apiSuccessExample {json} Success-Response:
  {
    "createdAt": "2017-05-17T08:41:41.510Z",
    "updatedAt": "2017-05-19T11:39:16.970Z",
    "isDeleted": false,
    "roles": [
      "user"
    ],
    "_id": "591c0cc5407eba1706aeb43e",
    "email": "test2@mail.com",
    "firstName": "title1",
    "lastName": "testAdmin"
  }

 * @apiSuccess  {String} _id Users id
 * @apiSuccess  {String} email Email
 * @apiSuccess  {String} lastName Last name
 * @apiSuccess  {String} firstName First name
 * @apiSuccess  {String[]} roles User access roles
 * @apiSuccess  {Boolean} isDeleted Is user deleted
 * @apiSuccess  {String} createdAt User create date
 * @apiSuccess  {String} updatedAt User update date

  * @apiErrorExample {json} Error-Response:
    [{param: "email",message: "Valid email is required" }]

  * @apiError {Object} InvalidEmail { param: "email",message: "Valid email is required" }
  * @apiError {Object} FirstNameRequired { param: "firstName", message: "First Name is required" }
  * @apiError {Object} LastNameRequired { param: "lastName", message: "Last Name is required" }
  * @apiError {Object} UserNotFound { param: "email", message: "User not found" }
  * @apiUse accessTokenError
*/

router.put('/update', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const reqData = await userValidate.update(req.request.body, req.request.user);
    return userAction.update(reqData, req.request.user._id);
  });
});
