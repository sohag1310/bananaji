import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, BannerItem, BlogPost, SiteConfig, FilterConfig } from '../types';

// Site Content Interface
export interface SiteContentData {
  textOverrides?: Record<string, string>;
  imageOverrides?: Record<string, string>;
  hiddenElements?: string[];
  themeConfig?: {
    bg: string;
    text: string;
    accent: string;
    font: string;
  };
  siteSettings?: {
    siteTitle?: string;
    announcementText?: string;
    contactPhone?: string;
    contactEmail?: string;
    contactAddress?: string;
    deliveryFeeInsideDhaka?: number;
    deliveryFeeOutsideDhaka?: number;
    currencySymbol?: string;
  };
  htmlSnapshot?: string;
  updatedAt: string;
}

// 1. Save Live Editor Changes & Site Settings to Firebase Firestore
export async function saveSiteContentToFirebase(
  contentData: Partial<SiteContentData>
): Promise<boolean> {
  try {
    const docRef = doc(db, 'site_content', 'main_snapshot');
    const data: SiteContentData = {
      ...contentData,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, data, { merge: true });
    
    // Also store in localStorage as offline fallback
    if (contentData.textOverrides) {
      localStorage.setItem('bananaji_text_overrides', JSON.stringify(contentData.textOverrides));
    }
    if (contentData.imageOverrides) {
      localStorage.setItem('bananaji_image_overrides', JSON.stringify(contentData.imageOverrides));
    }
    if (contentData.hiddenElements) {
      localStorage.setItem('bananaji_hidden_elements', JSON.stringify(contentData.hiddenElements));
    }
    if (contentData.themeConfig) {
      localStorage.setItem('bananaji_theme_config', JSON.stringify(contentData.themeConfig));
    }
    if (contentData.siteSettings) {
      localStorage.setItem('bananaji_site_settings', JSON.stringify(contentData.siteSettings));
    }
    console.log('Site changes successfully saved to Firebase Firestore!');
    return true;
  } catch (error) {
    console.error('Error saving site content to Firebase:', error);
    return false;
  }
}

// 2. Fetch Live Editor Changes from Firebase Firestore
export async function getSiteContentFromFirebase(): Promise<SiteContentData | null> {
  try {
    const docRef = doc(db, 'site_content', 'main_snapshot');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteContentData;
    }
  } catch (error) {
    console.error('Error fetching site content from Firebase:', error);
  }
  return null;
}

// 3. Save Products to Firebase
export async function syncProductsToFirebase(products: Product[]): Promise<void> {
  try {
    for (const prod of products) {
      const prodRef = doc(db, 'products', prod.id);
      await setDoc(prodRef, prod, { merge: true });
    }
  } catch (error) {
    console.error('Error syncing products to Firebase:', error);
  }
}

// 4. Fetch Products from Firebase
export async function getProductsFromFirebase(): Promise<Product[] | null> {
  try {
    const colRef = collection(db, 'products');
    const querySnap = await getDocs(colRef);
    if (!querySnap.empty) {
      const products: Product[] = [];
      querySnap.forEach((doc) => {
        products.push(doc.data() as Product);
      });
      return products;
    }
  } catch (error) {
    console.error('Error fetching products from Firebase:', error);
  }
  return null;
}

// 5. Save Order to Firebase
export async function saveOrderToFirebase(orderData: any): Promise<string | null> {
  try {
    const orderId = orderData.id || `BJ-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullOrder = {
      ...orderData,
      id: orderId,
      createdAt: orderData.createdAt || new Date().toISOString()
    };
    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, fullOrder, { merge: true });
    
    // Save to local storage list as persistent cache
    try {
      const localOrdersStr = localStorage.getItem('bananaji_saved_orders');
      const localOrders: Order[] = localOrdersStr ? JSON.parse(localOrdersStr) : [];
      const updated = [fullOrder as Order, ...localOrders.filter(o => o.id !== orderId)];
      localStorage.setItem('bananaji_saved_orders', JSON.stringify(updated));
    } catch {}

    return orderId;
  } catch (error) {
    console.error('Error saving order to Firebase:', error);
    return null;
  }
}

// 6. Fetch Orders from Firebase
export async function getOrdersFromFirebase(): Promise<Order[] | null> {
  try {
    const ordersCol = collection(db, 'orders');
    const querySnap = await getDocs(ordersCol);
    const orders: Order[] = [];

    if (!querySnap.empty) {
      querySnap.forEach((d) => {
        const data = d.data();
        orders.push({
          ...data,
          id: data.id || d.id
        } as Order);
      });
      
      // Update local storage to match fresh Firestore data
      try {
        localStorage.setItem('bananaji_saved_orders', JSON.stringify(orders));
      } catch {}
    } else {
      // If collection is empty in Firestore, check if we have local orders to seed or keep
      try {
        const localOrdersStr = localStorage.getItem('bananaji_saved_orders');
        if (localOrdersStr) {
          const localOrders: Order[] = JSON.parse(localOrdersStr);
          return localOrders;
        }
      } catch {}
    }

    if (orders.length > 0) {
      // Sort newest first
      orders.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0).getTime();
        const dateB = new Date(b.createdAt || b.date || 0).getTime();
        return dateB - dateA;
      });
      return orders;
    }
  } catch (error) {
    console.error('Error fetching orders from Firebase:', error);
  }
  return null;
}

// 7. Update Order Status in Firebase
export async function updateOrderStatusInFirebase(
  orderId: string, 
  status: Order['status'], 
  paymentStatus?: Order['paymentStatus'],
  extraFields?: {
    cancellationReason?: string;
    confirmedAt?: string;
    cancelledAt?: string;
    adminNotes?: string;
  }
): Promise<boolean> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: any = { 
      status, 
      id: orderId,
      updatedAt: new Date().toISOString(),
      ...(extraFields || {})
    };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    await setDoc(orderRef, updateData, { merge: true });

    // Update local cache
    try {
      const localOrdersStr = localStorage.getItem('bananaji_saved_orders');
      if (localOrdersStr) {
        const localOrders: Order[] = JSON.parse(localOrdersStr);
        const updated = localOrders.map(o => o.id === orderId ? { ...o, ...updateData } : o);
        localStorage.setItem('bananaji_saved_orders', JSON.stringify(updated));
      }
    } catch {}

    return true;
  } catch (error) {
    console.error('Error updating order status in Firebase:', error);
    return false;
  }
}

// 8. Confirm Order in Firebase (Sets status to Confirmed or Processing, updates timestamp)
export async function confirmOrderInFirebase(orderId: string, note?: string): Promise<boolean> {
  return updateOrderStatusInFirebase(orderId, 'Confirmed', 'Verified', {
    confirmedAt: new Date().toISOString(),
    adminNotes: note
  });
}

// 9. Cancel Order in Firebase (Sets status to Cancelled with reason)
export async function cancelOrderInFirebase(orderId: string, reason?: string): Promise<boolean> {
  return updateOrderStatusInFirebase(orderId, 'Cancelled', undefined, {
    cancellationReason: reason || 'Cancelled by Store Admin',
    cancelledAt: new Date().toISOString()
  });
}

// 10. Delete Order from Firebase
export async function deleteOrderFromFirebase(orderId: string): Promise<boolean> {
  try {
    // 1. Delete direct document by orderId
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);

    // 2. Also check if any doc exists where field id == orderId
    try {
      const col = collection(db, 'orders');
      const allDocs = await getDocs(col);
      for (const d of allDocs.docs) {
        const data = d.data();
        if (d.id === orderId || data.id === orderId) {
          await deleteDoc(doc(db, 'orders', d.id));
        }
      }
    } catch (innerErr) {
      console.warn('Additional doc cleanup warning:', innerErr);
    }

    // 3. Remove from local storage cache
    try {
      const localOrdersStr = localStorage.getItem('bananaji_saved_orders');
      if (localOrdersStr) {
        const localOrders: Order[] = JSON.parse(localOrdersStr);
        const filtered = localOrders.filter(o => o.id !== orderId);
        localStorage.setItem('bananaji_saved_orders', JSON.stringify(filtered));
      }
    } catch {}

    return true;
  } catch (error) {
    console.error('Error deleting order from Firebase:', error);
    return false;
  }
}

// 11. Admin Password Operations (Default: 9221)
export async function getAdminPasswordFromFirebase(): Promise<string> {
  try {
    const docRef = doc(db, 'admin_config', 'security');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data()?.password) {
      const dbPass = docSnap.data().password;
      localStorage.setItem('bananaji_admin_password', dbPass);
      return dbPass;
    }
  } catch (error) {
    console.error('Error fetching admin password from Firebase:', error);
  }
  const localPass = localStorage.getItem('bananaji_admin_password');
  if (localPass) return localPass;
  return '9221';
}

export async function saveAdminPasswordToFirebase(newPassword: string): Promise<boolean> {
  try {
    localStorage.setItem('bananaji_admin_password', newPassword);
    const docRef = doc(db, 'admin_config', 'security');
    await setDoc(docRef, { password: newPassword, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving admin password to Firebase:', error);
    return false;
  }
}

// 12. Delete Product from Firebase
export async function deleteProductFromFirebase(productId: string): Promise<boolean> {
  try {
    const prodRef = doc(db, 'products', productId);
    await deleteDoc(prodRef);

    // Also check any docs where id == productId
    try {
      const col = collection(db, 'products');
      const allDocs = await getDocs(col);
      for (const d of allDocs.docs) {
        const data = d.data();
        if (d.id === productId || data.id === productId) {
          await deleteDoc(doc(db, 'products', d.id));
        }
      }
    } catch (innerErr) {
      console.warn('Product doc cleanup warning:', innerErr);
    }

    try {
      const cached = localStorage.getItem('bananaji_products');
      if (cached) {
        const prods: Product[] = JSON.parse(cached);
        const filtered = prods.filter(p => p.id !== productId);
        localStorage.setItem('bananaji_products', JSON.stringify(filtered));
      }
    } catch {}

    return true;
  } catch (error) {
    console.error('Error deleting product from Firebase:', error);
    return false;
  }
}

// 13. Add Product Review to Firebase
export async function addProductReviewToFirebase(productId: string, updatedReviews: any[], newRating: number, newReviewCount: number): Promise<boolean> {
  try {
    const prodRef = doc(db, 'products', productId);
    await setDoc(prodRef, {
      reviews: updatedReviews,
      rating: newRating,
      reviewCount: newReviewCount
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error adding product review to Firebase:', error);
    return false;
  }
}

// 12. Save / Update User Profile in Firestore
export async function saveUserProfileToFirebase(profile: any): Promise<boolean> {
  try {
    if (!profile?.uid) return false;
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving user profile to Firebase:', error);
    return false;
  }
}

// 13. Get User Profile from Firestore
export async function getUserProfileFromFirebase(uid: string): Promise<any | null> {
  try {
    if (!uid) return null;
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (error) {
    console.error('Error fetching user profile from Firebase:', error);
  }
  return null;
}

// 14. Hero Banners Sync & Fetch from Firebase
export async function syncHeroBannersToFirebase(banners: BannerItem[]): Promise<boolean> {
  try {
    const docRef = doc(db, 'site_content', 'hero_banners');
    await setDoc(docRef, {
      banners,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem('bananaji_hero_banners', JSON.stringify(banners));
    return true;
  } catch (error) {
    console.error('Error syncing hero banners to Firebase:', error);
    return false;
  }
}

export async function getHeroBannersFromFirebase(): Promise<BannerItem[] | null> {
  try {
    const docRef = doc(db, 'site_content', 'hero_banners');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && Array.isArray(docSnap.data()?.banners) && docSnap.data().banners.length > 0) {
      return docSnap.data().banners as BannerItem[];
    }
  } catch (error) {
    console.error('Error fetching hero banners from Firebase:', error);
  }
  return null;
}

// 15. Blog Posts Sync & Fetch from Firebase
export async function syncBlogPostsToFirebase(posts: BlogPost[]): Promise<boolean> {
  try {
    const docRef = doc(db, 'site_content', 'blog_posts');
    await setDoc(docRef, {
      posts,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem('bananaji_blog_posts', JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Error syncing blog posts to Firebase:', error);
    return false;
  }
}

export async function getBlogPostsFromFirebase(): Promise<BlogPost[] | null> {
  try {
    const docRef = doc(db, 'site_content', 'blog_posts');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && Array.isArray(docSnap.data()?.posts) && docSnap.data().posts.length > 0) {
      return docSnap.data().posts as BlogPost[];
    }
  } catch (error) {
    console.error('Error fetching blog posts from Firebase:', error);
  }
  return null;
}

// 16. Filter Config (Categories & Ripeness) Sync & Fetch from Firebase
export async function syncFilterConfigToFirebase(filters: FilterConfig): Promise<boolean> {
  try {
    const docRef = doc(db, 'site_content', 'filters');
    await setDoc(docRef, {
      ...filters,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem('bananaji_filter_config', JSON.stringify(filters));
    return true;
  } catch (error) {
    console.error('Error syncing filter config to Firebase:', error);
    return false;
  }
}

export async function getFilterConfigFromFirebase(): Promise<FilterConfig | null> {
  try {
    // Try localStorage first for instantaneous load
    const cached = localStorage.getItem('bananaji_filter_config');
    const docRef = doc(db, 'site_content', 'filters');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && Array.isArray(docSnap.data()?.categories)) {
      const data = docSnap.data() as FilterConfig;
      localStorage.setItem('bananaji_filter_config', JSON.stringify(data));
      return data;
    }
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Error fetching filter config from Firebase:', error);
  }
  return null;
}

// 17. Complete Site Config (Logo, Brand Name, Contact, Fees, Texts) Sync & Fetch from Firebase
export async function syncSiteConfigToFirebase(config: SiteConfig): Promise<boolean> {
  try {
    const docRef = doc(db, 'site_content', 'site_config');
    await setDoc(docRef, {
      ...config,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem('bananaji_site_config', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error syncing site config to Firebase:', error);
    return false;
  }
}

export async function getSiteConfigFromFirebase(): Promise<SiteConfig | null> {
  try {
    const cached = localStorage.getItem('bananaji_site_config');
    const docRef = doc(db, 'site_content', 'site_config');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data()?.siteName) {
      const data = docSnap.data() as SiteConfig;
      localStorage.setItem('bananaji_site_config', JSON.stringify(data));
      return data;
    }
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Error fetching site config from Firebase:', error);
  }
  return null;
}
