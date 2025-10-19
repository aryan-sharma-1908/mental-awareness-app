exports.logout = (req,res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',

    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })

}