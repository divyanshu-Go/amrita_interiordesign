export function serializeUser(user) {
  if (!user) return null;

  return {
    id: user._id?.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,

    enterpriseProfile: user.enterpriseProfile
      ? {
          businessName: user.enterpriseProfile.businessName ?? "",
          gstNumber: user.enterpriseProfile.gstNumber ?? "",
          phone: user.enterpriseProfile.phone ?? "",
          status: user.enterpriseProfile.status,
          verifiedAt: user.enterpriseProfile.verifiedAt
            ? user.enterpriseProfile.verifiedAt.toISOString()
            : null,
        }
      : null,

    createdAt: user.createdAt
      ? user.createdAt.toISOString()
      : null,
    updatedAt: user.updatedAt
      ? user.updatedAt.toISOString()
      : null,
  };
}
