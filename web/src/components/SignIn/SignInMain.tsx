'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { postLogin } from '../../redux/Slice/Auth/authSlice';
import { AppDispatch } from '../../redux/store';
import { makeErrorToast, makeSuccessToast } from '../../utils/toast';

const SignInMain: React.FC = () => {
    const [userLogin, setUserLogin] = useState({
        username: '',
        password: '',
        keepSign: false,
    });
    const [passwordVisible, setPasswordVisible] = useState(true);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    //   console.log("token", authState.token);

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserLogin((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleKeepSignChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserLogin({ ...userLogin, keepSign: e.target.checked });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userPost: {
            username: string;
            password: string;
            keepSign: boolean;
        } = userLogin;
        dispatch(postLogin(userPost)).then((originalPromiseResult: any) => {
            if (originalPromiseResult.type === 'auth/postLogin/fulfilled') {
                makeSuccessToast(
                    `Đăng nhập thành công với tài khoản ${originalPromiseResult?.payload?.data?.data?.user.username}`,
                );
                localStorage.setItem('TOKEN', originalPromiseResult?.payload?.data?.data?.token);
                localStorage.setItem('USER', JSON.stringify(originalPromiseResult?.payload?.data?.data?.user));
                router.push('/');
                return;
            }
            if (originalPromiseResult.type === 'auth/postLogin/rejected') {
                makeErrorToast('Tên dăng nhập hoặc mật khẩu không đúng' ?? originalPromiseResult?.error?.message);
                return;
            }
        });
    };
    const [statusSignIn, setStatusSignIn] = useState(undefined);

    useEffect(() => {
        const getLocalStorage = JSON.parse(localStorage.getItem('session') || '{}');
        setStatusSignIn(getLocalStorage.isAuthenticated);
    }, []);

    if (statusSignIn === undefined) {
        return (
            <main className="">
                <section className="signup__area po-rel-z1 pt-24 pb-36">
                    <div className="sign__shape">
                        <Image
                            width={180}
                            height={180}
                            className="study"
                            src="/assets/img/icon/sign/study.png"
                            alt="img not found"
                        />
                        <Image
                            width={150}
                            height={123}
                            className="elearning"
                            src="/assets/img/icon/sign/elearning.png"
                            alt="img not found"
                        />
                        <Image
                            width={25}
                            height={20}
                            className="circle"
                            src="/assets/img/icon/sign/circle.png"
                            alt="img not found"
                        />
                        <Image
                            width={32}
                            height={17}
                            className="zigzag"
                            src="/assets/img/icon/sign/zigzag.png"
                            alt="img not found"
                        />
                        <Image
                            width={33}
                            height={63}
                            className="dot"
                            src="/assets/img/icon/sign/dot.png"
                            alt="img not found"
                        />
                        <Image
                            width={624}
                            height={680}
                            className="bg"
                            src="/assets/img/icon/sign/sign-up.png"
                            alt="img not found"
                        />
                    </div>
                    <div className="flex flex-col items-center justify-between ">
                        <div className="row">
                            <div className="">
                                <div className="section__title-wrapper text-center mb-14">
                                    <h2 className="section__title">
                                        Đăng nhập vào <br /> Apec Elearning.
                                    </h2>
                                    <p>
                                        Nếu chưa có tài khoản{' '}
                                        <Link
                                            style={{
                                                color: 'blue',
                                            }}
                                            href="/sign-up"
                                        >
                                            Đăng ký ở đây!
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row w-full lg:w-[35%] md:w-3/4">
                            <div className="w-[100%]">
                                <div className="sign__wrapper white-bg px-14 py-10">
                                    <div className="sign__header mb-9">
                                        <div className="sign__in text-center">
                                            <p>
                                                {' '}
                                                <span>........</span> Hoặc, <Link href="/sign-in">đăng nhập</Link> với
                                                email
                                                <span> ........</span>{' '}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="sign__form">
                                        <form action="" onSubmit={handleSubmit}>
                                            <div className="sign__input-wrapper mb-6">
                                                <h5>Email</h5>
                                                <div className="sign__input">
                                                    <div>
                                                        <i className="fas fa-envelope icon"></i>
                                                        <input
                                                            name="username"
                                                            type="text"
                                                            value={userLogin.username}
                                                            onChange={handleChangeInput}
                                                            placeholder="Your e-mail address"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sign__input-wrapper mb-10">
                                                <h5>Mật khẩu</h5>
                                                <div className="sign__input">
                                                    <div>
                                                        <i className="fas fa-lock icon"></i>
                                                        <input
                                                            name="password"
                                                            type={passwordVisible ? 'password' : 'text'}
                                                            value={userLogin.password}
                                                            onChange={handleChangeInput}
                                                            placeholder="Your password"
                                                        />
                                                        {passwordVisible ? (
                                                            <i
                                                                className="fas fa-eye icon_eye cursor-pointer"
                                                                onClick={() => setPasswordVisible(false)}
                                                            ></i>
                                                        ) : (
                                                            <i
                                                                className="fas fa-eye-slash icon_eye cursor-pointer"
                                                                onClick={() => setPasswordVisible(true)}
                                                            ></i>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sign__action d-sm-flex justify-content-between mb-30">
                                                <div className="sign__agree d-flex align-items-center">
                                                    <input
                                                        className="m-check-input"
                                                        type="checkbox"
                                                        id="m-agree"
                                                        checked={userLogin.keepSign}
                                                        onChange={handleKeepSignChange}
                                                    />
                                                    <label className="m-check-label" htmlFor="m-agree">
                                                        Giữ đăng nhập
                                                    </label>
                                                </div>
                                                <div className="sign__forgot">
                                                    <a href="#">Quên mật khẩu?</a>
                                                </div>
                                            </div>
                                            <button className="e-btn mt-6 w-100">
                                                <span></span> Đăng nhập
                                            </button>
                                            <div className="sign__new text-center mt-10">
                                                <p>
                                                    Bạn chưa có tài khoản? <Link href="/sign-up">Đăng ký</Link>
                                                </p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    } else {
        router.push('/');
        return;
    }
};

export default SignInMain;
